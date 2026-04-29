import User from "../models/User";

export async function admin(req, res, next) {
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

    if(!user.isAdmin()) {
        return res.status(403);
    }

    req.user = user;
    next();
}
