use worker::Request;

use crate::{
    db,
    errors::GeneralError,
    helpers::log,
    strava::models::StravaAuthCode,
    strava::{models::StravaAthleteId, strava},
    SharedData,
};

pub async fn auth_with_strava(
    mut req: Request,
    shared_data: &SharedData,
) -> Result<String, GeneralError> {
    let auth_code = req.json::<StravaAuthCode>().await?;
    log(&format!("retrieved code: {:?}", auth_code.code.clone()));
    let response = strava::request_access_token_with_code(auth_code, &shared_data).await?;
    let saved_athlete_info = db::write_athlete_auth_info(response, &shared_data.db).await?;

    Ok(format!("{:?}", saved_athlete_info))
    /* TODO: take code, send to strava, receive response, dump needed data to database -- then on to retrieving activities! */
}

pub async fn retrieve_strava_activities(
    mut req: Request,
    shared_data: &SharedData,
) -> Result<String, GeneralError> {
    log("going to unwrap athlete id");
    let athlete_id = req
        .json::<StravaAthleteId>()
        .await?
        .athlete_id
        .parse::<i32>()?;
    log("going to retrieve all auth info from db");
    let athlete_auth_info =
        db::retrieve_strava_athlete_auth_info(&shared_data.db, athlete_id).await?;
    log("going to see if we need to refresh");
    let up_to_date_athlete_auth_info =
        strava::refresh_athlete_access_token_if_necessary(athlete_auth_info, shared_data).await?;
    // TODO: actually make call for activities
    Ok(format!("{:?}", up_to_date_athlete_auth_info))
}
