let getSpotifyBearerTokenUrl = "https://accounts.spotify.com/api/token",
    client_id = "37f7d88a10a045ca879d9ee501c1b7db",
    client_secret = "92d95ee6d9bc4ca2a7cfb4fda7d464f6",
    xWwwFormEncodedSpotifyCreds = "grant_type=client_credentials&client_id=" &
                                  client_id & "&client_secret=" & client_secret,
    spotifyAccessToken = Json.Document(Web.Contents(
        getSpotifyBearerTokenUrl,
        [
          Headers = [#"Content-Type" = "application/x-www-form-urlencoded"],
          Content = Text.ToBinary(xWwwFormEncodedSpotifyCreds)
        ]))[access_token],
    d_spotify_key = "Bearer " & spotifyAccessToken,
    opts =
        [
          Headers = [Authorization = d_spotify_key],
          Timeout = #duration(0, 0, 5, 0)
        ],
    playlists_refs =
        Table.SelectColumns(f_o_self_playlists, {"id_playlist", "playlist"}),
    playlists_refs_w_gender = Table.Join(playlists_refs, "playlist",
                                         od_playlists_categories, "playlist"),
    playlists_tracks = Table.AddColumn(
        playlists_refs_w_gender, "playlists_tracks_table",
        each get_playlist_tracks(opts, [id_playlist], [playlist])),
    select_just_tracks_payload =
        Table.SelectColumns(playlists_tracks, {"playlists_tracks_table"}),
    expand_playlists_tracks_table = Table.ExpandTableColumn(
        select_just_tracks_payload, "playlists_tracks_table",
        {"artists_name", "duration_ms", "name", "popularity"},
        {"artists_name", "duration_ms", "name", "popularity"}),
    changeType = Table.TransformColumnTypes(expand_playlists_tracks_table,
                                            {{"artists_name", type text},
                                             {"duration_ms", Int64.Type},
                                             {"name", type text},
                                             {"popularity", Int64.Type}}),
    addArtistTrack =
        Table.AddColumn(changeType, "artist_track",
                        each[artists_name] & " - " &[name], type text),
    sort_rows = Table.Sort(addArtistTrack, {{"artist_track", Order.Ascending},
                                            {"popularity", Order.Descending},
                                            {"duration_ms", Order.Descending}}),
    capitalized_each_word = Table.TransformColumns(
        sort_rows, {{"artist_track", Text.Proper, type text}}),
    removed_duplicates = Table.Distinct(capitalized_each_word, {"artist_track"})
                             in removed_duplicates