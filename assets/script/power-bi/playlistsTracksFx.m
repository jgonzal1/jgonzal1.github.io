(auth_opts, playlist_id, playlist_name)=>
let
    url = "https://api.spotify.com/v1/playlists/"&playlist_id&"/tracks?limit=50&offset=", // urlTable{0}[url], // first
    url1=url&"0",  s1=Web.Contents(url1,auth_opts), imp1=Json.Document(s1,65001), its1=imp1[items],
    itt1=Table.FromList(its1,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url2=url&"50", s2=Web.Contents(url2,auth_opts), imp2=Json.Document(s2,65001), its2=imp2[items],
    itt2=Table.FromList(its2,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url3=url&"100", s3=Web.Contents(url3,auth_opts), imp3=Json.Document(s3,65001), its3=imp3[items],
    itt3=Table.FromList(its3,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url4=url&"150", s4=Web.Contents(url4,auth_opts), imp4=Json.Document(s4,65001), its4=imp4[items],
    itt4=Table.FromList(its4,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url5=url&"200", s5=Web.Contents(url5,auth_opts), imp5=Json.Document(s5,65001), its5=imp5[items],
    itt5=Table.FromList(its5,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url6=url&"250", s6=Web.Contents(url6,auth_opts), imp6=Json.Document(s6,65001), its6=imp6[items],
    itt6=Table.FromList(its6,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    url7=url&"300", s7=Web.Contents(url7,auth_opts), imp7=Json.Document(s7,65001), its7=imp7[items],
    itt7=Table.FromList(its7,Splitter.SplitByNothing(),null,null,ExtraValues.Error),
    queries = Table.Combine({itt1,itt2,itt3,itt4,itt5,itt6,itt7}),
    expandPlaylistFields = Table.ExpandRecordColumn(
        queries, "Column1", {"added_at", "added_by", "track"}, {"added_at", "added_by", "track"}
    ),
    expandAddedBy = Table.ExpandRecordColumn(
        expandPlaylistFields, "added_by", {"id"}, {"added_by"}
    ),
    expandTrack = Table.ExpandRecordColumn(
        expandAddedBy, "track",
        {"album", "artists", "duration_ms", "id", "name", "popularity", "track_number"},
        {"album", "artists", "duration_ms", "id", "name", "popularity", "track_number"}
    ),
    expandAlbum = Table.ExpandRecordColumn(
        expandTrack, "album",
        {"name", "release_date", "total_tracks"},
        {"album_name", "album_release_date", "album_n_tracks"}
    ),
    expandArtists = Table.ExpandListColumn(expandAlbum, "artists"),
    expandedArtistsName = Table.ExpandRecordColumn(
        expandArtists, "artists", {"name"}, {"artists_name"}
    ),
    addPlaylistName = Table.AddColumn(expandedArtistsName, "playlist_name", each playlist_name, type text),
    typeColumns = Table.TransformColumnTypes(addPlaylistName,{
        {"added_at", type datetime}, {"added_by", type text}, {"album_name", type text},
        {"album_release_date", type text}, {"album_n_tracks", Int64.Type},
        {"artists_name", type text}, {"duration_ms", Int64.Type}, {"id", type text},
        {"name", type text}, {"popularity", Int64.Type}, {"track_number", Int64.Type}
    })
in
    typeColumns