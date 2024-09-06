let
    getSpotifyBearerTokenUrl = "https://accounts.spotify.com/api/token",
    // paste client_id and client_secret
    xWwwFormEncodedSpotifyCreds= "grant_type=client_credentials&client_id="&
        client_id&"&client_secret="&client_secret,
    spotifyAccessToken = Json.Document(Web.Contents(
        getSpotifyBearerTokenUrl, [
            Headers=[#"Content-Type" = "application/x-www-form-urlencoded"],
            Content = Text.ToBinary(xWwwFormEncodedSpotifyCreds)
        ]
    ))[access_token],
    d_spotify_key = "Bearer "&spotifyAccessToken,
    opts = [Headers=[Authorization=d_spotify_key],Timeout=#duration(0,0,5,0)],
    playlists_refs = Table.SelectColumns(
        spotifyPlaylistsByUser,{"id_playlist", "playlist"}
    ),
    //playlists_refs_w_gender = Table.Join(
    //    playlists_refs, "playlist", playlist_categories, "playlist"
    //),
    //#"Sorted Rows" = Table.Sort(playlists_refs_w_gender,{{"category", Order.Ascending}}),
    playlists_tracks = Table.AddColumn(
        playlists_refs, "playlists_tracks_table",
        each playlistTracksFx(opts, [id_playlist], [playlist])
    ),
    select_just_tracks_payload = Table.SelectColumns(
        playlists_tracks,{"playlists_tracks_table"}
    ),
    expand_playlists_tracks_table = Table.ExpandTableColumn(
        select_just_tracks_payload, "playlists_tracks_table", {
            "added_at", "added_by", "album_name", "album_release_date",
            "album_n_tracks", "artists_name", "duration_ms", "id",
            "name", "popularity", "track_number", "playlist_name"
        }, {
            "added_at", "added_by", "album_name", "album_release_date",
            "album_n_tracks", "artists_name", "duration_ms", "id",
            "name", "popularity", "track_number", "playlist_name"
        }
    ),
    changeType = Table.TransformColumnTypes(
        expand_playlists_tracks_table,{
            {"added_at", type datetime}, {"added_by", type text},
            {"album_name", type text}, {"album_release_date", type text},
            {"album_n_tracks", Int64.Type}, {"artists_name", type text},
            {"duration_ms", Int64.Type}, {"id", type text},
            {"name", type text}, {"popularity", Int64.Type},
            {"track_number", Int64.Type}, {"playlist_name", type text}
        }
    )
in
    changeType