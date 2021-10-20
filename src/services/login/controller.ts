import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
import { secret_key } from './../../../secret'
const prisma = new PrismaClient();

export const loginMerchant = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password ) {

    return res.status(400).send({ error: 'Incomplete parameter' });
  } else {
    const merchantUser = await prisma.merchant.findUnique({ where: { email: email } })
    
    if (merchantUser) {
      
      let matched = bcrypt.compareSync(password, merchantUser.password);

      if (matched) {
        try {
          const merchantData = merchantUser;
          
          // delete merchantData.password;
          const data = await jwt.sign({
            username: email,
            userType: "user",
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
