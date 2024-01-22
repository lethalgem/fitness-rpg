use worker::D1Database;

use crate::{
    errors::GeneralError,
    helpers::log,
    strava::models::{
        AccessTokenResponse, RefreshTokenResponse, StravaAthleteAuthInfo, StravaClientAuthInfo,
    },
};

pub async fn retrieve_strava_client_access_token(db: &D1Database) -> Result<String, GeneralError> {
    let statement = db.prepare(
        "SELECT id, access_token, refresh_token, expires_at FROM strava_client_info WHERE id=1",
    );
    let result = statement.all().await?;
    let info = result.results::<StravaClientAuthInfo>()?;
    log(&format!("{:?}", info));

    // TODO: deal with having an expired token
    Ok(info
        .first()
        .ok_or_else(|| GeneralError::DbErrorNoStravaClientAuthInfo)?
        .access_token
        .clone())
}

pub async fn retrieve_strava_athlete_auth_info(
    db: &D1Database,
    athlete_id: i32,
) -> Result<StravaAthleteAuthInfo, GeneralError> {
    let statement = db.prepare(
        "SELECT athlete_id, access_token, refresh_token, expires_at FROM strava_athlete_info WHERE athlete_id=?1",
    );
    let query = statement.bind(&[athlete_id.into()])?;
    let result = query.all().await?;
    let info = result.results::<StravaAthleteAuthInfo>()?;
    log(&format!("retrieved athlete auth info: {:?}", info));

    Ok(info
        .first()
        .ok_or_else(|| GeneralError::DbErrorNoStravaClientAuthInfo)?
        .clone())
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
        athlete_auth_info.athlete.id.into(),
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
    athlete_id: i32,
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
        athlete_id.into(),
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
