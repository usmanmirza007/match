import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { PrismaClient, UserType } from '@prisma/client';
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
var bcrypt = require('bcryptjs');
var path = require("path");
const jwt = require('jsonwebtoken')
import { secret_key } from './../../../secret'

const prisma = new PrismaClient();

export const registerRouter = async (req: Request, res: Response, next: NextFunction) => {
  const {firstName, lastName, email, password, username, psnId, type } = req.body;
  let usersType: UserType = type
  if (UserType.USER == type) {
    usersType = UserType.USER
  }
  if (!firstName || !lastName || !email || !password || !username || !psnId || !type) {

    return res.status(400).send({ error: 'Incomplete parameter' });
  } else {
    const merchant = await prisma.user.findUnique({ where: { email: email } })
    if (merchant) {
      return res.status(409).json({ message: 'User with email is already register' })
    } else {

      try {

        var hash = bcrypt.hashSync(password, 8);
        const user = await prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            psdId: psnId,
            username: username,
            userType: usersType,
            email: email,
            password: hash,
          }
        })
        return res.status(200).json({ response: 'Registered Successfully'})
      } catch (error) {
        console.log('error', error)
        return res.status(500).json({ message: 'something went wrong' })
      }
    }
  }

};


export const loginRouter = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {

    return res.status(400).send({ error: 'Incomplete parameter' });
  } else {
    const user = await prisma.user.findUnique({ where: { email: email } })

    if (user) {

      let matched = bcrypt.compareSync(password, user.password);

      if (matched) {
        try {
          const merchantData = user;

          // delete merchantData.password;
          const data = await jwt.sign({
            username: email,
            userType: user.userType,
            id: merchantData.id,
          }, secret_key.secret, {
            expiresIn: '4h',
            algorithm: secret_key.algorithms[0]
          });
          delete user.password
          return res.status(200).json({jwt: data, ...user})
        } catch (error) {
          return res.status(500).json({ message: 'something went wrong' })
        }
      } else {
        return res.status(401).json({ message: 'Incorrect Credentail' })
      }
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  }

};
// export const registerBulkUserRouter = async (req: any, res: Response) => {
//   try {
//     if (req.file == undefined) {
//       return res.status(400).json({message: "Please upload an excel file!"})
//     }
//     let realtivePath = path.resolve("uploads/" + req.file.filename);

//     console.log('yoyoy', realtivePath);
    
//     readXlsxFile(realtivePath).then(async (rows: any) => {
//       // skip header
//       rows.shift();

//       let bulkUsers: any = [];

//       rows.forEach((row: any) => {
//         let users = {
//           user_name: row[0],
//           password: row[1],
//           email: row[2],
//           contact: row[3],
//           subscription_mode: row[4],
//         };
//         bulkUsers.push(users);
//       });

//       prisma.$transaction(
//         bulkUsers.map((data: any) => {
//           return prisma.user.upsert({
//             where: { email: data.email },
//             update: {},
//             create: {
//               user_name: data.user_name,
//               email: data.email,
//               contact: data.contact.toString(),
//               password: data.password,
//               subscription_mode: data.subscription_mode,
//             },
//           })
//         })
//       ).then(() => {
//         return res.status(200).json({})

//       }).catch((error) => {
//         return res.status(500).json({ message: 'Some fileds are missing in excel file' })
//       }
//       )

//     })
//   } catch (error) {
//     res.status(500).json({
//       message: "Could not upload the file: " + req.file.originalname,
//     });
//   }

// };
