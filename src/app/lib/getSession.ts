import { cookies } from "next/headers";
import { getScalekit } from "./scalekit";

export async function getSession() {
    const session = await cookies()
    const token = session.get("access_token")?.value
    if (!token) {
        return null
    }
    try {
        const scalekit = getScalekit()
        const result: any = await scalekit.validateToken(token)
        const user = await scalekit.user.getUser(result.sub)
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}
