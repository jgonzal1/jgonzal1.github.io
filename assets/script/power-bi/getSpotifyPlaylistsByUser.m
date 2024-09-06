let
    getSpotifyBearerTokenUrl = "https://accounts.spotify.com/api/token",
    // paste client_id and client_secret
    xWwwFormEncodedSpotifyCreds= "grant_type=client_credentials&client_id="&client_id&"&client_secret="&client_secret,
    spotifyAccessToken = Json.Document(Web.Contents(
        getSpotifyBearerTokenUrl, [
            Headers=[#"Content-Type" = "application/x-www-form-urlencoded"],
            Content = Text.ToBinary(xWwwFormEncodedSpotifyCreds)
        ]
    ))[access_token],
    d_spotify_key = "Bearer "&spotifyAccessToken,
    url = "https://api.spotify.com/v1/users/darkjavier/playlists?offset=", // 1/me/p 1/users/darkjavier/p
    Opts = [Headers=[Authorization=d_spotify_key],Timeout=#duration(0,0,5,0)],
    url1=url&"0&limit=40",  s1=Web.Contents(url1,Opts), imp1=Json.Document(s1,65001), its1=imp1[items],
    itt1=Table.FromList(its1,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url2=url&"40&limit=40", s2=Web.Contents(url2,Opts), imp2=Json.Document(s2,65001), its2=imp2[items],
    itt2=Table.FromList(its2,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url3=url&"80&limit=40", s3=Web.Contents(url3,Opts), imp3=Json.Document(s3,65001), its3=imp3[items],
    itt3=Table.FromList(its3,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url4=url&"120&limit=40", s4=Web.Contents(url4,Opts), imp4=Json.Document(s4,65001), its4=imp4[items],
    itt4=Table.FromList(its4,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url5=url&"160&limit=40", s5=Web.Contents(url5,Opts), imp5=Json.Document(s5,65001), its5=imp5[items],
    itt5=Table.FromList(its5,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url6=url&"200&limit=40", s6=Web.Contents(url6,Opts), imp6=Json.Document(s6,65001), its6=imp6[items],
    itt6=Table.FromList(its6,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    queries = Table.Combine({itt1,itt2,itt3,itt4,itt5,itt6}),
    expand_cols = Table.ExpandRecordColumn(queries, "Column1", {
        "id",          "name",     "tracks",  "owner",           "description", "images",             "public"
    }, {
        "id_playlist", "playlist", "n_songs", "_username_owner", "d_playlist",  "url_image_playlist", "public"
    }),
    expand_url_image_playlist = Table.ExpandListColumn(expand_cols, "url_image_playlist"),
    get_img_playlist_child = Table.ExpandRecordColumn(
        expand_url_image_playlist, "url_image_playlist", {"url"}, {"url_image_playlist"}
    ),
    expand_username_owner = Table.ExpandRecordColumn(
        get_img_playlist_child, "_username_owner", {"display_name", "id"}, {"username_owner", "id_username_owner"}
    ),
    expand_n_songs = Table.ExpandRecordColumn(expand_username_owner, "n_songs", {"total"}, {"n_songs"}),
    type_cols = Table.TransformColumnTypes(expand_n_songs,{{"d_playlist", type text}, {"url_image_playlist", type text}, {"playlist", type text}, {"username_owner", type text}, {"n_songs", Int64.Type}, {"id_playlist", type text}, {"id_username_owner", type text}, {"public", type logical}}),
    select_distinct = Table.Distinct(type_cols, {"id_playlist"}),
    last_query_tracks = Table.AddColumn(select_distinct, "last_query_tracks", each Number.Mod([n_songs], 100), type number),
    repace_complete = Table.ReplaceValue(last_query_tracks,0,100,Replacer.ReplaceValue,{"last_query_tracks"}),
    sort_by_n_songs = Table.Sort(repace_complete,{{"n_songs", Order.Descending}}),
    add_index = Table.AddIndexColumn(sort_by_n_songs, "index", 1, 1, Int64.Type)
in
    add_index