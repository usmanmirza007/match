import { NextFunction, Request, Response } from 'express';
import { PrismaClient, UserType, Visible } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } })

    if (user) {
      return res.status(200).json(user)
    } else {
      return res.status(404).json({ message: "user not found" })

    }
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};


export const createTournament = async (req: Request, res: Response, next: NextFunction) => {
  const { title, visibility, startDate, endDate, registrationDate, fee } = req.body;
  const userId = (req as any).user.id

  var tournamentVisibility: any
  if (visibility == Visible.PUBLIC) {
    tournamentVisibility = Visible.PUBLIC
  }

  if (visibility == Visible.PRIVATE) {
    tournamentVisibility = Visible.PRIVATE
  }

  if (!title || !visibility || !startDate || !endDate || !registrationDate || !fee) {
    return res.status(400).send({ error: 'Incomplete parameter' });
  }

  try {
    const tournament = await prisma.tournament.create({
      data: {
        title: title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationDate: new Date(registrationDate),
        userId: parseInt(userId),
        fee: parseInt(fee),
        visibility: tournamentVisibility
      }
    })

    return res.status(200).json({})
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }

};

export const getAllTournament = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id

  try {
    const tournament = await prisma.tournament.findMany({
      where: {
        userId: parseInt(userId)
      },
      include: { FollowTournament: { select: { userId: true } } }
    })
    if (tournament.length) {
      return res.status(200).json(tournament)
    }
    else {
      return res.status(404).json([])
    }
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};

export const deleteTournament = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id
  const { tournamentId } = req.params

  if (!tournamentId)
    return res
      .status(400)
      .json({ error: 'Request should have tournamentId' });

  try {

    await prisma.tournament.delete({
      where: {
        id: parseInt(tournamentId)
      }
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  const { name, playerNumber } = req.body;
  const userId = (req as any).user.id

  if (!name || !playerNumber) {
    return res.status(400).send({ error: 'Incomplete parameter' });
  }

  try {
    const tournament = await prisma.team.create({
      data: {
        name: name,
        userId: parseInt(userId),
        playerNumber: parseInt(playerNumber),
      }
    })

    return res.status(200).json({})
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }

};

export const createPlayer = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const userId = (req as any).user.id
  const { teamId } = req.params

  if (!name) {
    return res.status(400).send({ error: 'Incomplete parameter' });
  }

  const exsitTeam = await prisma.team.findFirst({ where: { id: parseInt(teamId) } })
  if (exsitTeam) {

    try {
      const tournament = await prisma.player.create({
        data: {
          name: name,
          teamId: parseInt(teamId),
        }
      })

      return res.status(200).json({})
    } catch (error) {
      console.log('err', error);
      return res.status(500).json({ message: 'something went wrong' })
    }
  } else {
    return res.status(404).json({ message: 'Team no found' })

  }

};

export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id

  try {
    const team = await prisma.team.findMany({
      where: {
        userId: parseInt(userId)
      }
    })
    if (team.length) {
      return res.status(200).json(team)
    }
    else {
      return res.status(404).json([])
    }
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};

export const getAllTeam = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id

  try {
    const allTeam = await prisma.team.findMany()

    if (allTeam.length) {
      return res.status(200).json(allTeam)
    }
    else {
      return res.status(404).json([])
    }
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};

export const getPlayer = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id

  try {
    const teams = await prisma.team.findMany({
      where: {
        userId: parseInt(userId)
      }
    })

    if (!teams.length) {
      return res.status(404).json({ message: 'Player not found' })

    }
    const teamCondition: Array<{ teamId: number }> = []

    for (const team of teams) {
      teamCondition.push({ teamId: team.id })
    }
    const players = await prisma.player.findMany({
      where: {
        OR: teamCondition
      }
    })
    if (players.length) {
      return res.status(200).json(players)
    }
    else {
      return res.status(404).json([])
    }
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};

export const deletePlayer = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id
  const { playerId } = req.params

  if (!playerId)
    return res
      .status(400)
      .json({ error: 'Request should have playerId' });

  try {

    await prisma.player.delete({
      where: {
        id: parseInt(playerId)
      }
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};

export const getTournamentFollow = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).user.id
  if (!userId)
    return res
      .status(400)
      .json({ error: 'Request should have userId' });

  try {

    const user = await prisma.user.findUnique({ where: { id: userId }, include: { Tournament: true } })
    const teamCondition: Array<{ tournamentId: number }> = []

    if (user) {

      for (const tournament of user.Tournament) {
        teamCondition.push({ tournamentId: tournament.id })
      }
    }

export const createMatch = async (req: Request, res: Response, next: NextFunction) => {
  const { firstTeamId, secondTeamId, startDate } = req.body;
  const userId = (req as any).user.id

  if (!firstTeamId || !secondTeamId || !startDate) {
    return res.status(400).send({ error: 'Incomplete parameter' });
  }

  try {
    const match = await prisma.match.create({
      data: {
        userId: userId,
        firstTeamId: parseInt(firstTeamId),
        secondTeamId: parseInt(secondTeamId),
        startDate: new Date(startDate)
      }
    })

    return res.status(200).json({})
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};

export const getMatch = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id

  try {
    const matchs = await prisma.match.findMany({
      where: { userId: userId }
    })

    return res.status(200).json(matchs)
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({ message: 'something went wrong' })
  }
};

