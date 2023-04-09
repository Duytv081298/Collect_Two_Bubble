import MainData from "../storage/MainData";
import FaceBook from "./FaceBook";

export class PlayfabManager {
    private static _instance: PlayfabManager = null;
    public hadLogin = false;
    public playfabId: string = "";
    public friends = [];
    public facebookMapIds: Map<string, string> = new Map();
    private titleResult: any = null;
    public static get install(): PlayfabManager {
        if (this._instance === null) {
            this._instance = new PlayfabManager();
        }
        return this._instance;
    }

    constructor() {
        // console.log("PlayFab1: ", window.PlayFab);
        // console.log("PlayFab2: ", PlayFab);

        if (MainData.instance().isTest) PlayFab.settings.titleId = "A5B34";
        else PlayFab.settings.titleId = "A5838";
    }
    login(signature: any) {
        if (this.hadLogin) return;
        console.log("login: ", signature);
        console.log("PlayFab.settings.titleId: " + PlayFab.settings.titleId);
        
        let requestLogin = {
            TitleId: PlayFab.settings.titleId,
            FacebookInstantGamesSignature: signature,
            CreateAccount: true,
        };
        PlayFabClientSDK.LoginWithFacebookInstantGamesId(
            requestLogin,
            (result: any, error) => {
                if (error) {
                    PlayfabManager.install.hadLogin = false;
                } else {
                    console.log("login complete", result);
                    PlayfabManager.install.hadLogin = true;
                    PlayfabManager.install.playfabId = result.data.PlayFabId;
                    PlayfabManager.install.checkFriendList();
                    PlayfabManager.install.updateUserNameAndPhoto();
                }
            }
        );
    }

    async checkFriendList() {
        let fbFiendIds = [];
        MainData.instance().friends = [];
        await FBInstant.player.getConnectedPlayersAsync().then((players) => {
            players.forEach((player: FBInstant.ConnectedPlayer) => {
                MainData.instance().friends.push({
                    avatar: player.getPhoto(),
                    name: player.getName(),
                    id: player.getID(),
                    isFb: true
                })

            });
        });
        for (let i = 0; i < MainData.instance().friends.length; i++) {
            fbFiendIds.push(MainData.instance().friends[i].id);
        }

        let playfabIds = [];
        const chunkSize = 25;
        for (let i = 0; i < fbFiendIds.length; i += chunkSize) {
            const chunk = fbFiendIds.slice(i, i + chunkSize);
            let arr = await this.getPlayfabID(chunk);
            for (let id of arr) {
                playfabIds.push(id);
            }
        }
        // console.log("playfabIds : ", playfabIds);
        this.addFriendListWithPlayfabIDs(playfabIds);
    }
    addFriendListWithPlayfabIDs(playfabIds: any[]) {
        let friendListRequest = <PlayFabClientModels.GetFriendsListRequest>{};
        PlayFabClientSDK.GetFriendsList(friendListRequest, async (result, err) => {
            if (!err) {
                console.log("result GetFriendsList : ", result);
                let friends = result.data.Friends;
                // PlayfabManager.install.friends = friends;
                let pfFriendIds = [];
                for (let i = 0; i < friends.length; i++) {
                    pfFriendIds.push(friends[i].FriendPlayFabId);
                    PlayfabManager.install.friends.push(friends[i].FriendPlayFabId)
                }
                if (playfabIds && playfabIds.length > 0) {
                    for (let i = 0; i < playfabIds.length; i++) {
                        if (pfFriendIds.indexOf(playfabIds[i]) < 0) {
                            this.addFriend(playfabIds[i]);
                        }
                    }
                }
                cc.game.emit("RELOAD_RANKING");
            } else {
                console.log("PlayFab GetFriendsList err", err);
                cc.game.emit("RELOAD_RANKING");
            }
        });
    }

    addFriend(friendPlayfabId: string) {
        if (!this.hadLogin) {
            return;
        }
        let request = {
            FriendPlayFabId: friendPlayfabId,
        };
        PlayFabClientSDK.AddFriend(request, (result, err) => {
            if (err) {
                console.log("addFriend err", friendPlayfabId, err);
                return;
            } else {
                console.log("PlayfabManager.install.friends: ", PlayfabManager.install.friends);
                console.log("addFriend done ", friendPlayfabId, " : ", result);

            }
        });
    }
    getFriends(): Promise<PlayFabClientModels.FriendInfo[]> {
        if (!this.hadLogin) {
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }
        // console.log("getFriends getFriends getFriends");
        let friendListRequest = <PlayFabClientModels.GetFriendsListRequest>{
            IncludeFacebookFriends: true,
            ProfileConstraints: {
                ShowDisplayName: true,
                ShowAvatarUrl: true,
                ShowStatistics: true,
            },
        };
        return new Promise(async (resolve) => {
            PlayFabClientSDK.GetFriendsList(friendListRequest, (result, err) => {
                if (!err) {
                    console.log("Friends playfab", result);
                    PlayfabManager.install.friends = result.data.Friends;
                    resolve(result.data.Friends);
                } else {
                    console.log("PlayFab GetFriendsList err", err);
                    resolve(null);
                }
            });
        });
    }
    getPlayfabID(fbIds: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            let request = {
                FacebookInstantGamesIds: fbIds,
            };
            PlayFabClientSDK.GetPlayFabIDsFromFacebookInstantGamesIds(
                request,
                (result, err) => {
                    // your self
                    PlayfabManager.install.facebookMapIds.set(
                        PlayfabManager.install.playfabId,
                        FaceBook.getID()
                    );
                    if (err) {
                        console.log("getPlayfabID err", err);
                        resolve([]);
                    } else {
                        let playfabIds = [];
                        const datas = result.data.Data;
                        for (let i = 0; i < datas.length; i++) {
                            if (datas[i].PlayFabId) {
                                playfabIds.push(datas[i].PlayFabId);
                                PlayfabManager.install.facebookMapIds.set(
                                    datas[i].PlayFabId,
                                    datas[i].FacebookInstantGamesId
                                );
                            }
                        }
                        resolve(playfabIds);
                    }
                }
            );
        });
    }
    updateUserNameAndPhoto() {
        if (!this.hadLogin) return;
        let newName = FaceBook.getName();
        let sub_id = PlayfabManager.install.playfabId.substring(0, 5);
        newName = newName + "_" + sub_id;
        PlayFabClientSDK.UpdateUserTitleDisplayName(
            {
                DisplayName: `${newName}`,
            },
            (result, err) => {
                if (err) console.log("Update Username err", err);
                else console.log("Update Username done", result);
            }
        );
        PlayFabClientSDK.UpdateAvatarUrl(
            {
                ImageUrl: FaceBook.getPhoto(),
            },
            (result, err) => {
                if (err) console.log("Update AvatarUrl err", err);
                else console.log("Update AvatarUrl done", result);
            }
        );
    }
    getUserPublisherData(playfabId: string, keys: string[]) {
        if (!this.hadLogin) {
            return;
        }
        let request = <PlayFabClientModels.GetUserDataRequest>{
            PlayFabId: playfabId,
            Keys: keys,
        };

        return new Promise(async (resolve) => {
            PlayFabClientSDK.GetUserPublisherData(request, (result, err) => {
                if (!err) {
                    // console.error("getUserPublisherData", result.data.Data);
                    resolve(result.data.Data);
                } else {
                    // console.error("getUserPublisherData err", err);
                    resolve(null);
                }
            });
        });
    }
    updateUserPublisherData(key: string, value: number | any) {
        if (!this.hadLogin) {
            return;
        }
        let request = <PlayFabClientModels.UpdateUserDataRequest>{
            data: { [key]: value },
            Permission: "Public",
        };

        PlayFabClientSDK.UpdateUserPublisherData(request, (result, err) => {
            if (!err) {
                console.log("updateUserPublisherData", result);
            } else {
                console.log("updateUserPublisherData err", err);
            }
        });
    }
    getLeaderboardFriend(contextId: string): Promise<any> {
        if (!this.hadLogin) {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }
        console.log("getLeaderboardFriend");
        let getLeaderboardRequest = <PlayFabClientModels.GetFriendLeaderboardRequest>{
            StatisticName: contextId,
            StartPosition: 0,
            MaxResultsCount: 30,
            ProfileConstraints: {
                ShowDisplayName: true,
                ShowAvatarUrl: true,
                ShowStatistics: true,
            },
        };
        return new Promise(async (resolve) => {
            PlayFabClientSDK.GetFriendLeaderboard(
                getLeaderboardRequest,
                (result, err) => {
                    if (err) {
                        console.log("getLeaderboardFriend err", err);
                        resolve([]);
                    } else {
                        console.log("getLeaderboardFriend done", result);
                        resolve(result.data.Leaderboard);
                    }
                }
            );
        });
    }
    public getLeaderboardGlobal(name?: string): Promise<any> {
        if (!this.hadLogin) {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }

        let getLeaderboardRequest = <PlayFabClientModels.GetLeaderboardRequest>{
            StatisticName: name ? name : PlayfabManager.WEEKLY,
            StartPosition: 0,
            MaxResultsCount: 30,
            ProfileConstraints: {
                ShowDisplayName: true,
                ShowAvatarUrl: true,
                ShowStatistics: true,
            },
        };

        return new Promise(async (resolve) => {
            PlayFabClientSDK.GetLeaderboard(
                getLeaderboardRequest,
                (result, err) => {
                    if (err) {
                        console.log("getLeaderboardGlobal err", err);
                        resolve([]);
                    } else {
                        resolve(result.data.Leaderboard);
                    }
                }
            );
        });
    }
    public getLeaderboardGlobalAround(): Promise<any> {
        if (!this.hadLogin) {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }

        let getLeaderboardRequest = <PlayFabClientModels.GetLeaderboardRequest>{
            StatisticName: PlayfabManager.WEEKLY,
            StartPosition: 0,
            MaxResultsCount: 30,
            ProfileConstraints: {
                ShowAvatarUrl: true,
            },
        };

        return new Promise(async (resolve) => {
            PlayFabClientSDK.GetLeaderboardAroundPlayer(
                getLeaderboardRequest,
                (result, err) => {
                    if (err) {
                        console.log("getLeaderboardGlobal err", err);
                        resolve([]);
                    } else {
                        resolve(result.data);
                    }
                }
            );
        });
    }
    public getCurrentRank(): Promise<any> {
        if (!this.hadLogin) {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }

        let getLeaderboardRequest = <PlayFabClientModels.GetLeaderboardRequest>{
            StatisticName: PlayfabManager.WEEKLY,
            MaxResultsCount: 1,
            ProfileConstraints: {
                ShowAvatarUrl: true,
                ShowDisplayName: true,
            },
        };

        return new Promise(async (resolve) => {
            PlayFabClientSDK.GetLeaderboardAroundPlayer(
                getLeaderboardRequest,
                (result, err) => {
                    if (err) {
                        console.log("getLeaderboardGlobal err", err);
                        resolve([]);
                    } else {
                        resolve(result.data.Leaderboard);
                    }
                }
            );
        });
    }
    public getTournamentLeaderboardAsync(
        contextId: string
    ): Promise<null | any> {
        if (!this.hadLogin) {
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }
        let getLeaderboardRequest = <PlayFabClientModels.GetLeaderboardRequest>{
            StatisticName: contextId,
            StartPosition: 0,
            MaxResultsCount: 30,
            ProfileConstraints: {
                ShowDisplayName: true,
                ShowAvatarUrl: true,
                ShowStatistics: true,
            },
        };

        return new Promise(async (resolve) => {
            PlayFabClientSDK.GetLeaderboard(
                getLeaderboardRequest,
                (result, err) => {
                    if (err) {
                        console.log("getLeaderboardGlobal err", err);
                        resolve(null);
                    } else {
                        resolve(result.data);
                    }
                }
            );
        });
    }

    public updateScoreToLeaderboardAsync(
        leaderboardName: string,
        scoreValue: number
    ) {
        if (!this.hadLogin) {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        }
        return new Promise((resolve, rejected) => {
            const request = {
                Statistics: [
                    {
                        StatisticName: leaderboardName,
                        Value: scoreValue,
                    },
                ],
            };
            PlayFabClientSDK.UpdatePlayerStatistics(request, (result, error) => {
                if (error) {
                    console.log(
                        `updateScoreToLeaderboardAsync error ${error.errorMessage}`
                    );
                    rejected(error);
                }
                resolve(true);
            });
        });
    }
    public updateFacebookId(
        key: string,
        value: string
    ) {
        var request = {
            "PlayFabId": PlayfabManager.install.playfabId,
            "Data": {
                "FBID": FaceBook.getID()
            }
        };

        PlayFabClientSDK.UpdateUserData(request, function (result, error) {
            if (error) {
                console.log("UpdateUserData error:", error.errorMessage);
            } else {
                console.log("Public data saved successfully!");
            }
        });
    }
    public sendScore(score: number) {
        console.log("send score: ", score, this.hadLogin);
        if (!this.hadLogin) return;

        let requestUpdateUserData = {
            Statistics: [
                {
                    StatisticName: PlayfabManager.WEEKLY,
                    Value: score,
                },
            ],
        };
        PlayFabClientSDK.UpdatePlayerStatistics(
            requestUpdateUserData,
            (result, err) => {
                if (err) {
                    console.log("UpdatePlayerStatistics err", err);
                    return;
                }
                // console.log("UpdatePlayerStatistics done", result);
            }
        );
    }
    public getFbIdByPlayfabId(playfabId: string) {
        return this.facebookMapIds.get(playfabId);
    }

    public static get LEVEL() {
        return "level";
    }

    public static get WORLD() {
        return "World";
    }
    public static get WEEKLY() {
        return "WEEKLY";
    }
    public static get fakeUUIDS() {
        return ["123234231", "213242342", "1234123422", "23423423"];
    }
}
