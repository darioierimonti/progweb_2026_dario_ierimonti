import User from "../models/User";

export async function auth(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return res.redirect(302, "/login.html");
    }

    /**
     *
     * @type {null|User}
     */
    const user = await User.tokenAuthenticate(token);

    if(!user) {
        return res.redirect(302, "/login.html");
    }

    req.user = user;
    next();
}
