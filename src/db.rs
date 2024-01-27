use worker::{D1Database, D1PreparedStatement};

use crate::{
    errors::GeneralError,
    helpers::log,
    strava::models::{
        AccessTokenResponse, RefreshTokenResponse, StravaAthleteAuthInfo,
        StravaAthleteAuthInfoDbRep, StravaClientAuthInfo, SummaryActivity,
    },
};

pub async fn retrieve_strava_client_auth_info(
    db: &D1Database,
) -> Result<StravaClientAuthInfo, GeneralError> {
    let statement = db.prepare(
        "SELECT id, access_token, refresh_token, expires_at FROM strava_client_info WHERE id=1",
    );
    let result = statement.all().await?;
    let info = result.results::<StravaClientAuthInfo>()?;
    log(&format!("{:?}", info));

    Ok(info
        .first()
        .ok_or_else(|| GeneralError::DbErrorNoStravaClientAuthInfo)?
        .clone())
}

pub async fn write_updated_client_auth_info(
    updated_client_auth_info: RefreshTokenResponse,
    db: &D1Database,
) -> Result<StravaClientAuthInfo, GeneralError> {
    let write_statement = db.prepare(
        "UPDATE strava_client_info 
        SET access_token = ?2, expires_at = ?3, refresh_token = ?4 
        WHERE id = ?1;",
    );
    let params = [
        1.into(),
        updated_client_auth_info.access_token.clone().into(),
        updated_client_auth_info.expires_at.to_string().into(),
        updated_client_auth_info.refresh_token.clone().into(),
    ];
    let query = write_statement.bind(&params)?;
    let result = query.run().await?;

    match result.error() {
        Some(e) => {
            log("failed to write data");
            Err(GeneralError::DbError(e))
        }
        None => {
            log("successfully wrote data");
            Ok(StravaClientAuthInfo {
                id: 1,
                access_token: updated_client_auth_info.access_token,
                refresh_token: updated_client_auth_info.refresh_token,
                expires_at: updated_client_auth_info.expires_at.to_string(),
            })
        }
    }
}

pub async fn retrieve_strava_athlete_auth_info(
    db: &D1Database,
    athlete_id: i32,
) -> Result<StravaAthleteAuthInfo, GeneralError> {
    log("reading athlete auth info from db");
    let statement = db.prepare(
        "SELECT athlete_id, access_token, refresh_token, expires_at FROM strava_athlete_info WHERE athlete_id=?1",
    );
    let query = statement.bind(&[athlete_id.to_string().into()])?;
    let result = query.all().await?;
    let info = result.results::<StravaAthleteAuthInfoDbRep>()?;
    log(&format!("retrieved athlete auth info: {:?}", info));

    let auth_info = StravaAthleteAuthInfo::try_from(
        info.first()
            .ok_or_else(|| GeneralError::DbErrorNoStravaClientAuthInfo)?
            .clone(),
    )?;

    Ok(auth_info)
}

pub async fn write_athlete_auth_info(
    athlete_auth_info: AccessTokenResponse,
    db: &D1Database,
) -> Result<StravaAthleteAuthInfo, GeneralError> {
    let write_statement = db.prepare(
        "INSERT INTO strava_athlete_info (athlete_id, access_token, expires_at, refresh_token) 
    VALUES (?1, ?2, ?3, ?4)
    ON CONFLICT(athlete_id) DO UPDATE SET 
    access_token = excluded.access_token, 
    expires_at = excluded.expires_at, 
    refresh_token = excluded.refresh_token",
    );
    let params = [
        athlete_auth_info.athlete.id.to_string().into(),
        athlete_auth_info.access_token.clone().into(),
        athlete_auth_info.expires_at.to_string().into(),
        athlete_auth_info.refresh_token.clone().into(),
    ];
    let query = write_statement.bind(&params)?;
    let result = query.run().await?;

    match result.error() {
        Some(e) => {
            log("failed to write data");
            Err(GeneralError::DbError(e))
        }
        None => {
            log("successfully wrote data");
            Ok(StravaAthleteAuthInfo {
                athlete_id: athlete_auth_info.athlete.id,
                access_token: athlete_auth_info.access_token,
                refresh_token: athlete_auth_info.refresh_token,
                expires_at: athlete_auth_info.expires_at.to_string(),
            })
        }
    }
}

pub async fn write_updated_athlete_auth_info(
    updated_athlete_auth_info: RefreshTokenResponse,
    athlete_id: i64,
    db: &D1Database,
) -> Result<StravaAthleteAuthInfo, GeneralError> {
    let write_statement = db.prepare(
        "INSERT INTO strava_athlete_info (athlete_id, access_token, expires_at, refresh_token) 
    VALUES (?1, ?2, ?3, ?4)
    ON CONFLICT(athlete_id) DO UPDATE SET 
    access_token = excluded.access_token, 
    expires_at = excluded.expires_at, 
    refresh_token = excluded.refresh_token",
    );
    let params = [
        athlete_id.to_string().into(),
        updated_athlete_auth_info.access_token.clone().into(),
        updated_athlete_auth_info.expires_at.to_string().into(),
        updated_athlete_auth_info.refresh_token.clone().into(),
    ];
    let query = write_statement.bind(&params)?;
    let result = query.run().await?;

    match result.error() {
        Some(e) => {
            log("failed to write data");
            Err(GeneralError::DbError(e))
        }
        None => {
            log("successfully wrote data");
            Ok(StravaAthleteAuthInfo {
                athlete_id,
                access_token: updated_athlete_auth_info.access_token,
                refresh_token: updated_athlete_auth_info.refresh_token,
                expires_at: updated_athlete_auth_info.expires_at.to_string(),
            })
        }
    }
}

pub async fn write_athlete_activity_summary_info(
    activities: &Vec<SummaryActivity>,
    athlete_id: &i64,
    db: &D1Database,
) -> Result<(), GeneralError> {
    log("starting to batch activity summary info");
    let mut batched_statements: Vec<D1PreparedStatement> = Vec::new();
    for activity in activities {
        let write_statement = db.prepare(
            "INSERT INTO strava_activity_info (athlete_id, activity_id, sport_type, moving_time, elapsed_time) 
        VALUES (?1, ?2, ?3, ?4, ?5)
        ON CONFLICT(activity_id) DO UPDATE SET 
        athlete_id = excluded.athlete_id,
        sport_type = excluded.sport_type,
        moving_time = excluded.moving_time,
        elapsed_time = excluded.elapsed_time",
        );
        let sport_type = activity
            .sport_type
            .as_ref()
            .map_or("null".to_owned(), |sport| sport.to_string());
        let moving_time = activity
            .moving_time
            .as_ref()
            .map_or("null".to_owned(), |time| time.to_string());
        let elapsed_time = activity
            .elapsed_time
            .as_ref()
            .map_or("null".to_owned(), |time| time.to_string());
        let params = [
            athlete_id.to_string().into(),
            activity.id.to_string().into(),
            sport_type.into(),
            moving_time.into(),
            elapsed_time.into(),
        ];
        let bound_statement = write_statement.bind(&params)?;
        batched_statements.push(bound_statement)
    }

    log("executing batched query with activity summary info");
    let results = db.batch(batched_statements).await?;

    log("checking batched query results for errors");
    let errors: Vec<String> = results
        .into_iter()
        .filter_map(|result| result.error())
        .collect();
    if !errors.is_empty() {
        for error in errors.clone() {
            log(&error)
        }
        Err(GeneralError::DbError(errors.first().unwrap().to_string()))
    } else {
        log("successfully batched activity info");
        Ok(())
    }

    // match result.error() {
    //     Some(e) => {
    //         log("failed to write data");
    //         Err(GeneralError::DbError(e))
    //     }
    //     None => {
    //         log("successfully wrote data");
    //         Ok(StravaAthleteAuthInfo {
    //             athlete_id,
    //             access_token: updated_athlete_auth_info.access_token,
    //             refresh_token: updated_athlete_auth_info.refresh_token,
    //             expires_at: updated_athlete_auth_info.expires_at.to_string(),
    //         })
    //     }
    // }
}
