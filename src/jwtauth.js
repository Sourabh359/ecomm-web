// @ts-nocheck
import jwt from "jsonwebtoken";

/**
 * @param {import("express").Request} req
 * @param {string} name
 */
function getCookie(req, name) {
     const cookieHeader = req.headers.cookie;

     if (!cookieHeader) return null;

     const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
     const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

     if (!match) return null;

     return decodeURIComponent(match.slice(name.length + 1));
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default function authenticate(req,res,next){
     const authHeader=req.headers.authorization;
     const token=authHeader?.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : getCookie(req, "token");

     if(!token){
          return res.status(401).json({message: 'Token Missing'})
     }

     const secret = process.env.JWT_SECRET;

     if (!secret) {
          return res.status(500).json({ message: 'JWT secret not configured' });
     }

     try{
          const decode=jwt.verify(token, secret);
          req.user=decode;
          next();
     }
     catch(err){
          return res.status(401).json({message:'Invalid or Expired Token'})
     }

}