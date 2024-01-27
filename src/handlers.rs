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
    let response = strava::request_access_token_with_code(auth_code, shared_data).await?;
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
    let athlete_auth_info = strava::get_athlete_auth_info(athlete_id, shared_data).await?;
    let activites = strava::request_all_athlete_activities(&athlete_auth_info).await;
    // TODO: paginate to get full amount
    // TODO: write all activity id's to db
    // TODO: every 15min request detailed activities -> eventually with chron workers, for now lets do latest 30 activites to get someone started
    // maybe just pull a page then write to db then pull then write? Do I care about batching all of it rn? Would that be too much data to store in memory?
    Ok(format!("{:?}", activites))
}
