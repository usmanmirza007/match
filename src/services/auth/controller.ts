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
        return res.status(200).json({})
      } catch (error) {
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
          return res.status(200).json(data)
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

