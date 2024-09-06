let api_key = "",
    prefix = "https://ws.audioscrobbler.com/2.0/?api_key=" & api_key &
             "&format=json&limit=999&",
    url_top_global_artists = prefix & "method=chart.gettopartists",
    url_user_top_tracks = prefix & "method=user.gettoptracks&user=darkjavier",
    t1 = Table.FromRecords(
        {Json.Document(Web.Contents(url_user_top_tracks & "&page=1"))}),
    t2 = Table.FromRecords(
        {Json.Document(Web.Contents(url_user_top_tracks & "&page=2"))}),
    t3 = Table.FromRecords(
        {Json.Document(Web.Contents(url_user_top_tracks & "&page=3"))}),
    t4 = Table.FromRecords(
        {Json.Document(Web.Contents(url_user_top_tracks & "&page=4"))}),
    t5 = Table.FromRecords(
        {Json.Document(Web.Contents(url_user_top_tracks & "&page=5"))}),
    merged_table = Table.Combine({t1, t2, t3, t4, t5}),
    expanded_toptracks = Table.ExpandRecordColumn(
        merged_table, "toptracks", {"track"}, {"toptracks.track"}),
    expand_track =
        Table.ExpandListColumn(expanded_toptracks, "toptracks.track"),
    expand_track1 = Table.ExpandRecordColumn(
        expand_track, "toptracks.track",
        {"mbid", "name", "artist", "url", "duration", "@attr", "playcount"},
        {"track_mbid", "track_name", "track_artist", "track_url",
         "track_duration", "track_attr", "track_playcount"}),
    expand_track_artist = Table.ExpandRecordColumn(
        expand_track1, "track_artist", {"url", "name", "mbid"},
        {"artist_url", "artist_name", "artist_mbid"}),
    expand_track_attr = Table.ExpandRecordColumn(
        expand_track_artist, "track_attr", {"rank"}, {"track_rank"}),
    changed_Type = Table.TransformColumnTypes(
        expand_track_attr, {{"track_mbid", type text},
                            {"track_name", type text},
                            {"artist_url", type text},
                            {"artist_name", type text},
                            {"artist_mbid", type text},
                            {"track_url", type text},
                            {"track_duration", Int64.Type},
                            {"track_rank", Int64.Type},
                            {"track_playcount", Int64.Type}}),
    add_artist_track = Table.AddColumn(changed_Type, "artist_track",
                                       each[artist_name] & " - " &[track_name],
                                       type text) in add_artist_track