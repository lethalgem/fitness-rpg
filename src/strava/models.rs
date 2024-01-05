use serde::{Deserialize, Serialize};

use crate::models::StravaAuthCode;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AccessTokenRequest {
    pub client_id: String,
    pub client_secret: String,
    pub code: String,
    pub grant_type: String,
}

impl AccessTokenRequest {
    fn new(code: StravaAuthCode) -> AccessTokenRequest {
        AccessTokenRequest {
            client_id: std::env::var("CLIENT_ID").expect("$CLIENT_ID is not set"),
            client_secret: std::env::var("CLIENT_SECRET").expect("$CLIENT_SECRET is not set"),
            code: code.code,
            grant_type: "authorization_code".to_owned(),
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AccessTokenResponse {
    pub token_type: String,
    pub expires_at: i64,
    pub expires_in: i64,
    pub refresh_token: String,
    pub access_token: String,
    pub athlete: Athlete,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Athlete {
    pub id: i32,
    pub resource_state: ResourceState,
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub profile_medium: Option<String>,
    pub profile: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub country: Option<String>,
    pub sex: Option<String>,
    pub friend: Option<String>,
    pub follower: Option<String>,
    pub premium: Option<bool>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
    pub approve_followers: Option<bool>,
    pub follower_count: Option<i32>,
    pub friend_count: Option<i32>,
    pub mutual_friend_count: Option<i32>,
    pub date_preference: Option<String>,
    pub measurement_preference: Option<String>,
    pub email: Option<String>,
    pub ftp: Option<i32>,
    pub weight: Option<f32>,
    pub athlete_type: Option<i32>,
    pub clubs: Option<Vec<Club>>,
    pub shoes: Option<Vec<Gear>>,
    pub bikes: Option<Vec<Gear>>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum ResourceState {
    Unknown,
    Meta,
    Summary,
    Detailed,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Club {
    id: i32,
    resource_state: ResourceState,
    name: String,

    profile_medium: Option<String>,
    profile: Option<String>,
    cover_photo: Option<String>,
    cover_photo_small: Option<String>,
    sport_type: Option<SportType>,
    city: Option<String>,
    state: Option<String>,
    country: Option<String>,
    private: Option<bool>,
    member_count: Option<i32>,
    featured: Option<bool>,
    verified: Option<bool>,
    url: Option<String>,

    description: Option<String>,
    club_type: Option<ClubType>,
    membership: Option<String>,
    admin: Option<bool>,
    owner: Option<bool>,
    following_count: Option<i32>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[allow(non_camel_case_types)]
pub enum SportType {
    cycling,
    running,
    triathlon,
    other,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[allow(non_camel_case_types)]
pub enum ClubType {
    casual_club,
    racing_team,
    shop,
    company,
    other,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Gear {
    pub id: String,
    pub primary: bool,
    pub name: String,
    pub distance: f32,
    pub resource_state: ResourceState,
    pub brand_name: Option<String>,
    pub model_name: Option<String>,
    pub frame_type: Option<FrameType>,
    pub description: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum FrameType {
    MTB,
    Cross,
    Road,
    TimeTrial,
}
