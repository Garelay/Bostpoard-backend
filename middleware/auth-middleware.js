import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) return res.status(401).send("Unauthorized")

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) return res.status(401).send("Unauthorized")
        
        const userData = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        if (!userData) return res.status(401).send("Unauthorized")
        
        req.user = userData;
        next();
    } catch (e) {
        return res.status(401).send("Unauthorized")
    }
};