mod errors;
mod handlers;
mod helpers;
mod models;
mod strava;
use helpers::log;
use wasm_bindgen::JsValue;
use web_sys::console;
use worker::*;

// This is a shared data struct that we will pass to the router
struct SharedData {
    name: String,
    env: Environment,
}

struct Environment {
    client_id: String,
    client_secret: String,
}

#[event(fetch)]
async fn main(req: Request, env: Env, ctx: Context) -> Result<Response> {
    let shared_data = SharedData {
        name: "Rusty".to_string(),
        env: Environment {
            client_id: env
                .var("CLIENT_ID")
                .expect("Missing Client ID environment variable")
                .to_string(),
            client_secret: env
                .var("CLIENT_SECRET")
                .expect("Missing Client Secret environment variable")
                .to_string(),
        },
    };

    let router = Router::with_data(shared_data);

    router
        .get("/", |_, ctx| Response::ok("Hello, World!"))
        .get("/strava-integration-redirect-uri", |mut req, ctx| {
            Response::ok("This will never exist, it will be in the front end")
        })
        .post_async("/auth_with_strava", |mut req, ctx| async move {
            let yeet = ctx.data.env.client_id;
            log(&yeet);

            Response::ok("This will never exist, it will be in the front end")

            // match auth_with_strava(req).await {
            //     Ok(code) => Response::ok(code),
            //     Err(err) => Response::ok(format!("{}", err)),
            // }
        })
        .get("/shared-data", |_, ctx| {
            let shared_data = ctx.data.name;
            Response::ok(shared_data)
        })
        .run(req, env)
        .await
}
