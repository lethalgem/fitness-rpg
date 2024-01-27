use serde::{Deserialize, Deserializer, Serialize};
use strum_macros::{Display, EnumString};

use super::errors::StravaAPIError;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaAuthCode {
    pub code: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaAthleteId {
    pub athlete_id: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaClientAuthInfo {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: String,
    pub id: i64,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RefreshTokenRequest {
    pub client_id: String,
    pub client_secret: String,
    pub refresh_token: String,
    pub grant_type: String,
}

impl RefreshTokenRequest {
    pub fn new(
        refresh_token: String,
        client_id: String,
        client_secret: String,
    ) -> Result<RefreshTokenRequest, StravaAPIError> {
        Ok(RefreshTokenRequest {
            client_id,
            client_secret,
            refresh_token,
            grant_type: "refresh_token".to_owned(),
        })
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct RefreshTokenResponse {
    pub token_type: String,
    pub expires_at: i64,
    pub expires_in: i64,
    pub refresh_token: String,
    pub access_token: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaAthleteAuthInfo {
    pub athlete_id: i64,
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: String,
}

impl TryFrom<StravaAthleteAuthInfoDbRep> for StravaAthleteAuthInfo {
    type Error = std::num::ParseIntError;

    fn try_from(item: StravaAthleteAuthInfoDbRep) -> Result<Self, Self::Error> {
        let athlete_id = item.athlete_id.parse::<i64>()?;
        Ok(StravaAthleteAuthInfo {
            athlete_id,
            access_token: item.access_token,
            refresh_token: item.refresh_token,
            expires_at: item.expires_at,
        })
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct StravaAthleteAuthInfoDbRep {
    pub athlete_id: String,
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AccessTokenRequest {
    pub client_id: String,
    pub client_secret: String,
    pub code: String,
    pub grant_type: String,
}

impl AccessTokenRequest {
    pub fn new(
        code: StravaAuthCode,
        client_id: String,
        client_secret: String,
    ) -> Result<AccessTokenRequest, StravaAPIError> {
        Ok(AccessTokenRequest {
            client_id,
            client_secret,
            code: code.code,
            grant_type: "authorization_code".to_owned(),
        })
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
    pub id: i64,
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
    pub username: Option<String>,
    pub bio: Option<String>,
    pub summit: Option<bool>,
    pub badge_type_id: Option<i64>,
}

#[derive(Clone, Debug, Serialize)]
pub enum ResourceState {
    Unknown,
    Meta,
    Summary,
    Detailed,
}

impl<'de> Deserialize<'de> for ResourceState {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let i = i32::deserialize(deserializer)?;
        match i {
            1 => Ok(ResourceState::Meta),
            2 => Ok(ResourceState::Summary),
            3 => Ok(ResourceState::Detailed),
            _ => Ok(ResourceState::Unknown),
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Club {
    id: i64,
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

#[derive(Clone, Debug, Deserialize, Serialize, EnumString, Display)]
#[allow(non_camel_case_types)]
pub enum SportType {
    AlpineSki,
    BackcountrySki,
    Badminton,
    Canoeing,
    Crossfit,
    EBikeRide,
    Elliptical,
    EMountainBikeRide,
    Golf,
    GravelRide,
    Handcycle,
    HighIntensityIntervalTraining,
    Hike,
    IceSkate,
    InlineSkate,
    Kayaking,
    Kitesurf,
    MountainBikeRide,
    NordicSki,
    Pickleball,
    Pilates,
    Racquetball,
    Ride,
    RockClimbing,
    RollerSki,
    Rowing,
    Run,
    Sail,
    Skateboard,
    Snowboard,
    Snowshoe,
    Soccer,
    Squash,
    StairStepper,
    StandUpPaddling,
    Surfing,
    Swim,
    TableTennis,
    Tennis,
    TrailRun,
    Velomobile,
    VirtualRide,
    VirtualRow,
    VirtualRun,
    Walk,
    WeightTraining,
    Wheelchair,
    Windsurf,
    Workout,
    Yoga,
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

#[derive(Clone, Debug, Deserialize, Serialize, EnumString, Display)]
pub enum FrameType {
    MTB,
    Cross,
    Road,
    TimeTrial,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ListAthleteActivitiesRequest {
    pub before: Option<i64>,
    pub after: Option<i64>,
    pub page: Option<i32>,
    pub per_page: Option<i32>,
}

impl ListAthleteActivitiesRequest {
    pub fn new(
        before: Option<i64>,
        after: Option<i64>,
        page: Option<i32>,
        per_page: Option<i32>,
    ) -> ListAthleteActivitiesRequest {
        ListAthleteActivitiesRequest {
            before,
            after,
            page,
            per_page,
        }
    }

    pub fn default() -> ListAthleteActivitiesRequest {
        ListAthleteActivitiesRequest {
            before: None,
            after: None,
            page: None,
            per_page: None,
        }
    }

    pub fn new_with_page_number(page: i32) -> ListAthleteActivitiesRequest {
        ListAthleteActivitiesRequest {
            before: None,
            after: None,
            page: Some(page),
            per_page: None,
        }
    }
}

pub type ListAthleteActivitiesResponse = Vec<SummaryActivity>;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct SummaryActivity {
    pub id: i64,
    pub external_id: Option<String>,
    pub upload_id: Option<i64>,
    pub athlete: Option<MetaAthlete>,
    pub name: Option<String>,
    pub distance: Option<f32>,
    pub moving_time: Option<i32>,
    pub elapsed_time: Option<i32>,
    pub total_elevation_gain: Option<f32>,
    pub elev_high: Option<f32>,
    pub elev_low: Option<f32>,
    pub sport_type: Option<SportType>,
    pub start_date: Option<String>,
    pub start_date_local: Option<String>,
    pub timezone: Option<String>,
    pub start_latlng: Option<Vec<f32>>,
    pub end_latlng: Option<Vec<f32>>,
    pub achievement_count: Option<i32>,
    pub kudos_count: Option<i32>,
    pub comment_count: Option<i32>,
    pub athlete_count: Option<i32>,
    pub photo_count: Option<i32>,
    pub total_photo_count: Option<i32>,
    pub map: Option<PolylineMap>,
    pub trainer: Option<bool>,
    pub commute: Option<bool>,
    pub manual: Option<bool>,
    pub private: Option<bool>,
    pub flagged: Option<bool>,
    pub workout_type: Option<i32>,
    pub upload_id_str: Option<String>,
    pub average_speed: Option<f32>,
    pub max_speed: Option<f32>,
    pub has_kudoed: Option<bool>,
    pub hide_from_home: Option<bool>,
    pub gear_id: Option<String>,
    pub kilojoules: Option<f32>,
    pub average_watts: Option<f32>,
    pub device_watts: Option<bool>,
    pub max_watts: Option<i32>,
    pub weighted_average_watts: Option<i32>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct MetaAthlete {
    pub id: i64,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Cords {
    x: f32,
    y: f32,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct PolylineMap {
    id: String,
    polyline: Option<String>,
    summary_polyline: String,
    resource_state: ResourceState,
}
