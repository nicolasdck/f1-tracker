// Logique pure (pas de req/res) partagee entre la fonction serverless Vercel
// (api/lollipopman-video.ts) et le middleware de dev Vite (vite.config.ts), pour
// que `npm run dev` ET le deploiement Vercel se comportent identiquement.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Chaine Lollipopman Comics (https://www.youtube.com/@lollipopmancomics), channel id
// UCvBO5Do9eiSDVY3qY7tfX7A. Uploads playlist = channel id avec "UC" remplace par "UU"
// (convention YouTube standard).
var UPLOADS_PLAYLIST_ID = "UUvBO5Do9eiSDVY3qY7tfX7A";
// Les vraies videos de recap ont toujours un titre du type
// "... | {Course} GP {annee}" (ex: "Peak Pace | Austrian GP 2026").
// Ca les distingue des shorts/memes/autres contenus postes entre deux.
var RECAP_TITLE_PATTERN = /\bGP\s*20\d{2}\b/i;
// La chaine publie generalement le mercredi suivant le week-end de course.
var MATCH_WINDOW_DAYS = 10;
var MAX_PAGES = 5;
function fetchPlaylistPage(apiKey, pageToken) {
    return __awaiter(this, void 0, void 0, function () {
        var url, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
                    url.searchParams.set("part", "snippet");
                    url.searchParams.set("playlistId", UPLOADS_PLAYLIST_ID);
                    url.searchParams.set("maxResults", "50");
                    url.searchParams.set("key", apiKey);
                    if (pageToken)
                        url.searchParams.set("pageToken", pageToken);
                    return [4 /*yield*/, fetch(url.toString())];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        throw new Error("YouTube API error ".concat(res.status));
                    }
                    return [2 /*return*/, res.json()];
            }
        });
    });
}
export function findLollipopmanVideo(apiKey, raceDate, keywords) {
    return __awaiter(this, void 0, void 0, function () {
        var windowStart, windowEnd, pageToken, page, data, _loop_1, _i, _a, item, state_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    windowStart = new Date(raceDate).getTime();
                    windowEnd = windowStart + MATCH_WINDOW_DAYS * 24 * 60 * 60 * 1000;
                    page = 0;
                    _b.label = 1;
                case 1:
                    if (!(page < MAX_PAGES)) return [3 /*break*/, 4];
                    return [4 /*yield*/, fetchPlaylistPage(apiKey, pageToken)];
                case 2:
                    data = _b.sent();
                    _loop_1 = function (item) {
                        var publishedAt = new Date(item.snippet.publishedAt).getTime();
                        if (publishedAt < windowStart) {
                            return { value: { videoId: null } };
                        }
                        if (publishedAt > windowEnd)
                            return "continue";
                        var title = item.snippet.title.toLowerCase();
                        if (!RECAP_TITLE_PATTERN.test(item.snippet.title))
                            return "continue";
                        if (keywords.some(function (k) { return title.includes(k); })) {
                            return { value: { videoId: item.snippet.resourceId.videoId, title: item.snippet.title } };
                        }
                    };
                    for (_i = 0, _a = data.items; _i < _a.length; _i++) {
                        item = _a[_i];
                        state_1 = _loop_1(item);
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                    }
                    if (!data.nextPageToken)
                        return [3 /*break*/, 4];
                    pageToken = data.nextPageToken;
                    _b.label = 3;
                case 3:
                    page++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, { videoId: null }];
            }
        });
    });
}
