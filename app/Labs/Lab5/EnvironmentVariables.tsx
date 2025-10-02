import { HTTP_SERVER } from "@/app/env";
const USERS_API = `${HTTP_SERVER}/api/users`;
export default function EnvironmentVariables() {
    return (
        <div id="wd-environment-variables">
            <h3>Environment Variables</h3>
            <p>Remote Server: {HTTP_SERVER}</p>
            <hr />
        </div>
    );
}
