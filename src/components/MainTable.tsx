import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  Paper,
  TableContainer,
  Avatar,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlayerStats from '../features/stats/types/PlayerStats';
import pathToAvatarImage from './utils/pathToAvatarImage';

function Row({ pStats }: { pStats: PlayerStats }): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ px: 2 }}>
          <IconButton
            aria-label="expand row"
            size="medium"
            onClick={() => setOpen(!open)}
            sx={{ p: 0 }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          align="center"
          sx={{
            ml: -2,
            p: 0,
            height: '4rem',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
          }}
        >
          <Avatar
            sx={{ mr: 0.5, width: 50, height: 50, border: 0 }}
            alt="user_avatar"
            src={pathToAvatarImage(pStats.avatar)}
          />
          <Box sx={{ fontSize: '0.95rem', textAlign: 'left', maxWidth: '4.8rem' }}>
            {pStats.username}
          </Box>
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          {pStats.betCount}
        </TableCell>
        <TableCell align="center" sx={{ px: 0.5 }}>
          {pStats.winRate.toFixed(0)}
        </TableCell>
        <TableCell
          align="center"
          sx={{
            px: 1,
            fontSize: '1.1rem',
            fontWeight: 600,
            color: pStats.actualBalance >= 0 ? 'green' : 'red',
          }}
        >
          {pStats.actualBalance.toFixed(2)}€
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0, textAlign: 'center' }}>
              <Typography
                sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}
                component="div"
              >
                Доп.статистика ({pStats.username})
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  <TableRow>
                    <TableCell align="center">Ставок выиграно:</TableCell>
                    <TableCell align="center" sx={{ bgcolor: '#e0f3e5', px: 1 }}>
                      <b>{pStats.wonBetCount}</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Ставок вернулось:</TableCell>
                    <TableCell align="center" sx={{ bgcolor: '#f9f8d9', px: 1 }}>
                      <b>{pStats.returnedBetCount}</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Ставок проиграно:</TableCell>
                    <TableCell align="center" sx={{ bgcolor: '#f9d9d9', px: 1 }}>
                      <b>{pStats.lostBetCount}</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Ставок пропущено:</TableCell>
                    <TableCell align="center" sx={{ bgcolor: '#e0dfe4', px: 1 }}>
                      <b>{pStats.emptyBetCount}</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" sx={{ p: 0 }}>
                      Процент выигранных ставок:
                    </TableCell>
                    <TableCell align="center" sx={{ bgcolor: '#c3cdf0', px: 1 }}>
                      <b>{pStats.winRate.toFixed(1)}%</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Средний кэф:</TableCell>
                    <TableCell align="center" sx={{ bgcolor: '#e0cde9', px: 1 }}>
                      <b>{pStats.averageOdds.toFixed(2)}</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" sx={{ fontSize: '0.82rem', px: 0 }}>
                      Средний кэф(выигранных ставок):
                    </TableCell>
                    <TableCell align="center" sx={{ bgcolor: '#d3edf2', px: 1 }}>
                      <b>{pStats.averageWonBetOdds.toFixed(2)}</b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function MainTable({
  playersStats,
}: {
  playersStats: PlayerStats[];
}): JSX.Element {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead sx={{ bgcolor: '#2d2d32', border: 2 }}>
          <TableRow>
            <TableCell />
            <TableCell
              align="left"
              sx={{ color: 'white', fontWeight: 600, py: 0.5 }}
            >
              Имя
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: '0.75rem',
                color: 'white',
                fontWeight: 600,
                px: 0,
                py: 0.5,
              }}
            >
              Ставок
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: 'white', fontWeight: 600, px: 0.5, py: 0.5 }}
            >
              %
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: 'white', fontWeight: 600, py: 0.5 }}
            >
              Баланс
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ border: 2 }}>
          {playersStats.map((pStats) => (
            <Row key={pStats.username} pStats={pStats} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
