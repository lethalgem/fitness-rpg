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
    log("saved strava auth info, going to request activities");

    let activities = strava::request_all_athlete_activities(&saved_athlete_info).await?;
    db::write_athlete_activity_summary_info(
        &activities,
        &saved_athlete_info.athlete_id,
        &shared_data.db,
    )
    .await?;
    log("successfully wrote activity summary info to db");

    Ok("Auth with Strava and initial activity retreival successful!".to_string())
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
    let activities = strava::request_all_athlete_activities(&athlete_auth_info).await?;
    db::write_athlete_activity_summary_info(
        &activities,
        &athlete_auth_info.athlete_id,
        &shared_data.db,
    )
    .await?;
    Ok("successful!".to_owned())
}

// TODO: every 15min request detailed activities -> eventually with chron workers, for now lets do latest 30 activites to get someone started
// TODO: go request all activity details to get calories then calc xp based on calories, if not available, sport type + moving time, or sport type + elapsed time if moving time not available
// TODO: webhooks!
