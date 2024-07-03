exports.isAdmin = (req, res, next) => {
    try {
        if(req.user.client !== 'admin') throw new Error();
        next();
    } catch (err) {
        res.status(401).json({
            message: "You are not authorized",
        });
    }
};