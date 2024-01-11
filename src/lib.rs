mod errors;
mod handlers;
mod helpers;
mod models;
mod strava;
use handlers::*;
use helpers::log;
use serde::{Deserialize, Serialize};
use worker::*;

// This is a shared data struct that we will pass to the router
struct SharedData {
    name: String,
    env: Environment,
}

pub struct Environment {
    client_id: String,
    client_secret: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Comment {
    id: u32,
    author: String,
    body: String,
    post_slug: String,
}

#[event(fetch)]
async fn main(req: Request, env: Env, ctx: Context) -> Result<Response> {
    // let shared_data = SharedData {
    //     name: "Rusty".to_string(),
    //     env: Environment {
    //         client_id: env
    //             .var("CLIENT_ID")
    //             .expect("Missing Client ID environment variable")
    //             .to_string(),
    //         client_secret: env
    //             .var("CLIENT_SECRET")
    //             .expect("Missing Client Secret environment variable")
    //             .to_string(),
    //     },
    // };

    // let router = Router::with_data(shared_data);

    //TODO: Make an offline version of the database to reference when running locally

    Router::new()
        .get("/", |_, ctx| Response::ok("Hello, World!"))
        .get("/strava-integration-redirect-uri", |mut req, ctx| {
            Response::ok("This will never exist, it will be in the front end")
        })
        .post_async("/auth_with_strava", |mut req, ctx| async move {
            let d1 = ctx.env.d1("DATABASE")?;
            log(&format!("{:?}", d1.dump().await?));
            let statement = d1.prepare("SELECT * FROM comments LIMIT 3");
            // log(&format!("{:?}", statement.raw::<Customer>().await?));
            // let query = statement.bind(&[id])?;
            let result = statement.all().await?;
            match result.results::<Comment>() {
                Ok(thing) => Response::from_json(&thing),
                Err(_) => Response::error("Not found", 404),
            }

            // Response::ok("body")

            // match auth_with_strava(req, ctx.data.env).await {
            //     Ok(code) => Response::ok(code),
            //     Err(err) => Response::ok(format!("{}", err)),
            // }
        })
        .get("/shared-data", |_, ctx| {
            // let shared_data = ctx.env.name;
            Response::ok("yeet")
        })
        .run(req, env)
        .await
}
