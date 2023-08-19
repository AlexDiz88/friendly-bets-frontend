import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import allBetsTitles from './allBetsTitles';

export default function BetInputTitle({
  onBetTitleSelect,
}: {
  onBetTitleSelect: (betTitle: string) => void;
}): JSX.Element {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const [expandedNestedAccordion, setExpandedNestedAccordion] = useState<
    string | false
  >(false);

  const handleButtonClick = (value: string): void => {
    onBetTitleSelect(value);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
      // cворачиваем вложенные аккордеоны при клике на верхнеуровневый
      setExpandedNestedAccordion(false);
    };

  const handleNestedAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedNestedAccordion(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ mt: 1.5, textAlign: 'center', maxWidth: '20rem' }}>
      <Typography sx={{ textAlign: 'left', mx: 1, mt: 1, fontWeight: '600' }}>
        Ставка
      </Typography>
      {/* Популярные */}
      <Accordion
        expanded={expandedAccordion === 'Популярные'}
        onChange={handleAccordionChange('Популярные')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-popular-content"
          id="panel-popular-header"
        >
          <Typography>Популярные</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {allBetsTitles.popular.map((b) => (
            <Button
              key={b}
              sx={{
                px: 0,
                m: 0.5,
                bgcolor: '#525252',
                height: '3rem',
                width: '5.5rem',
              }}
              variant="contained"
              onClick={() => handleButtonClick(b)}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {b}
              </Typography>
            </Button>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Результат матча + Тотал голов */}
      <Accordion
        expanded={expandedAccordion === 'Результат матча + Тотал голов'}
        onChange={handleAccordionChange('Результат матча + Тотал голов')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-gameResult_GoalsAmount-content"
          id="panel-gameResult_GoalsAmount-header"
        >
          <Typography>Результат матча + Тотал голов</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Результат матча */}
          <Accordion
            expanded={expandedNestedAccordion === 'Результат матча'}
            onChange={handleNestedAccordionChange('Результат матча')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-content"
              id="panel-gameResult-header"
            >
              <Typography>Результат матча</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.gameResult.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* П1 + Тотал меньше */}
          <Accordion
            expanded={expandedNestedAccordion === 'П1 + Тотал меньше'}
            onChange={handleNestedAccordionChange('П1 + Тотал меньше')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-homeTeamWin_GoalsTotalLess-content"
              id="panel-gameResult-homeTeamWin_GoalsTotalLess-header"
            >
              <Typography>П1 + Тотал меньше</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.homeTeamWin_GoalsTotalLess.map(
                (b) => (
                  <Button
                    key={b}
                    sx={{
                      px: 0,
                      m: 0.5,
                      bgcolor: '#525252',
                      height: '3rem',
                      width: '5.5rem',
                    }}
                    variant="contained"
                    onClick={() => handleButtonClick(b)}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {b}
                    </Typography>
                  </Button>
                )
              )}
            </AccordionDetails>
          </Accordion>

          {/* П1 + Тотал больше */}
          <Accordion
            expanded={expandedNestedAccordion === 'П1 + Тотал больше'}
            onChange={handleNestedAccordionChange('П1 + Тотал больше')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-homeTeamWin_GoalsTotalMore-content"
              id="panel-gameResult-homeTeamWin_GoalsTotalMore-header"
            >
              <Typography>П1 + Тотал больше</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.homeTeamWin_GoalsTotalMore.map(
                (b) => (
                  <Button
                    key={b}
                    sx={{
                      px: 0,
                      m: 0.5,
                      bgcolor: '#525252',
                      height: '3rem',
                      width: '5.5rem',
                    }}
                    variant="contained"
                    onClick={() => handleButtonClick(b)}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {b}
                    </Typography>
                  </Button>
                )
              )}
            </AccordionDetails>
          </Accordion>

          {/* 1Х + Тотал меньше */}
          <Accordion
            expanded={expandedNestedAccordion === '1Х + Тотал меньше'}
            onChange={handleNestedAccordionChange('1Х + Тотал меньше')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-homeTeamNotLose_GoalsTotalLess-content"
              id="panel-gameResult-homeTeamNotLose_GoalsTotalLess-header"
            >
              <Typography>1Х + Тотал меньше</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.homeTeamNotLose_GoalsTotalLess.map(
                (b) => (
                  <Button
                    key={b}
                    sx={{
                      px: 0,
                      m: 0.5,
                      bgcolor: '#525252',
                      height: '3rem',
                      width: '5.5rem',
                    }}
                    variant="contained"
                    onClick={() => handleButtonClick(b)}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {b}
                    </Typography>
                  </Button>
                )
              )}
            </AccordionDetails>
          </Accordion>

          {/* 1Х + Тотал больше */}
          <Accordion
            expanded={expandedNestedAccordion === '1Х + Тотал больше'}
            onChange={handleNestedAccordionChange('1Х + Тотал больше')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-homeTeamNotLose_GoalsTotalMore-content"
              id="panel-gameResult-homeTeamNotLose_GoalsTotalMore-header"
            >
              <Typography>1Х + Тотал больше</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.homeTeamNotLose_GoalsTotalMore.map(
                (b) => (
                  <Button
                    key={b}
                    sx={{
                      px: 0,
                      m: 0.5,
                      bgcolor: '#525252',
                      height: '3rem',
                      width: '5.5rem',
                    }}
                    variant="contained"
                    onClick={() => handleButtonClick(b)}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {b}
                    </Typography>
                  </Button>
                )
              )}
            </AccordionDetails>
          </Accordion>

          {/* Х + Тотал голов */}
          <Accordion
            expanded={expandedNestedAccordion === 'Х + Тотал голов'}
            onChange={handleNestedAccordionChange('Х + Тотал голов')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-draw_GoalsAmount-content"
              id="panel-gameResult-draw_GoalsAmount-header"
            >
              <Typography>Х + Тотал голов</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.draw_GoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* П2 + Тотал меньше */}
          <Accordion
            expanded={expandedNestedAccordion === 'П2 + Тотал меньше'}
            onChange={handleNestedAccordionChange('П2 + Тотал меньше')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-awayTeamWin_GoalsTotalLess-content"
              id="panel-gameResult-awayTeamWin_GoalsTotalLess-header"
            >
              <Typography>П2 + Тотал меньше</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.awayTeamWin_GoalsTotalLess.map(
                (b) => (
                  <Button
                    key={b}
                    sx={{
                      px: 0,
                      m: 0.5,
                      bgcolor: '#525252',
                      height: '3rem',
                      width: '5.5rem',
                    }}
                    variant="contained"
                    onClick={() => handleButtonClick(b)}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {b}
                    </Typography>
                  </Button>
                )
              )}
            </AccordionDetails>
          </Accordion>

          {/* П2 + Тотал больше */}
          <Accordion
            expanded={expandedNestedAccordion === 'П2 + Тотал больше'}
            onChange={handleNestedAccordionChange('П2 + Тотал больше')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-awayTeamWin_GoalsTotalMore-content"
              id="panel-gameResult-awayTeamWin_GoalsTotalMore-header"
            >
              <Typography>П2 + Тотал больше</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.awayTeamWin_GoalsTotalMore.map(
                (b) => (
                  <Button
                    key={b}
                    sx={{
                      px: 0,
                      m: 0.5,
                      bgcolor: '#525252',
                      height: '3rem',
                      width: '5.5rem',
                    }}
                    variant="contained"
                    onClick={() => handleButtonClick(b)}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {b}
                    </Typography>
                  </Button>
                )
              )}
            </AccordionDetails>
          </Accordion>

          {/* Х2 + Тотал меньше */}
          <Accordion
            expanded={expandedNestedAccordion === 'Х2 + Тотал меньше'}
            onChange={handleNestedAccordionChange('Х2 + Тотал меньше')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-awayTeamNotLose_GoalsTotalLess-content"
              id="panel-gameResult-awayTeamNotLose_GoalsTotalLess-header"
            >
              <Typography>Х2 + Тотал меньше</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.awayTeamNotLose_GoalsTotalLess.map(
                (b) => (
                  <Button
                    key={b}
                    sx={{
                      px: 0,
                      m: 0.5,
                      bgcolor: '#525252',
                      height: '3rem',
                      width: '5.5rem',
                    }}
                    variant="contained"
                    onClick={() => handleButtonClick(b)}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {b}
                    </Typography>
                  </Button>
                )
              )}
            </AccordionDetails>
          </Accordion>

          {/* Х2 + Тотал больше */}
          <Accordion
            expanded={expandedNestedAccordion === 'Х2 + Тотал больше'}
            onChange={handleNestedAccordionChange('Х2 + Тотал больше')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-awayTeamNotLose_GoalsTotalMore-content"
              id="panel-gameResult-awayTeamNotLose_GoalsTotalMore-header"
            >
              <Typography>Х2 + Тотал больше</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.awayTeamNotLose_GoalsTotalMore.map(
                (b) => (
                  <Button
                    key={b}
                    sx={{
                      px: 0,
                      m: 0.5,
                      bgcolor: '#525252',
                      height: '3rem',
                      width: '5.5rem',
                    }}
                    variant="contained"
                    onClick={() => handleButtonClick(b)}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {b}
                    </Typography>
                  </Button>
                )
              )}
            </AccordionDetails>
          </Accordion>

          {/* 12 + Тотал голов */}
          <Accordion
            expanded={expandedNestedAccordion === '12 + Тотал голов'}
            onChange={handleNestedAccordionChange('12 + Тотал голов')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameResult-no_draw_GoalsAmount-content"
              id="panel-gameResult-no_draw_GoalsAmount-header"
            >
              <Typography>12 + Тотал голов</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameResult_GoalsAmount.no_draw_GoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>

      {/* Тоталы */}
      <Accordion
        expanded={expandedAccordion === 'Тоталы'}
        onChange={handleAccordionChange('Тоталы')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-goalsAmount-content"
          id="panel-goalsAmount-header"
        >
          <Typography>Тоталы</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Тотал голов */}
          <Accordion
            expanded={expandedNestedAccordion === 'Тотал голов'}
            onChange={handleNestedAccordionChange('Тотал голов')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-goalsAmount-goalsTotalAmount-content"
              id="panel-goalsAmount-goalsTotalAmount-header"
            >
              <Typography>Тотал голов</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.goalsAmount.goalsTotalAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Хозяева - Индивидуальный тотал голов */}
          <Accordion
            expanded={
              expandedNestedAccordion === 'Хозяева - Индивидуальный тотал голов'
            }
            onChange={handleNestedAccordionChange(
              'Хозяева - Индивидуальный тотал голов'
            )}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-goalsAmount-homeTeamGoalsAmount-content"
              id="panel-goalsAmount-homeTeamGoalsAmount-header"
            >
              <Typography sx={{ fontSize: '0.95rem' }}>
                Хозяева - Индивидуальный тотал
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.goalsAmount.homeTeamGoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Гости - Индивидуальный тотал голов */}
          <Accordion
            expanded={
              expandedNestedAccordion === 'Гости - Индивидуальный тотал голов'
            }
            onChange={handleNestedAccordionChange(
              'Гости - Индивидуальный тотал голов'
            )}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-goalsAmount-awayTeamGoalsAmount-content"
              id="panel-goalsAmount-awayTeamGoalsAmount-header"
            >
              <Typography sx={{ fontSize: '0.95rem' }}>
                Гости - Индивидуальный тотал
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.goalsAmount.awayTeamGoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>

      {/* Форы */}
      <Accordion
        expanded={expandedAccordion === 'Форы'}
        onChange={handleAccordionChange('Форы')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-handicap-content"
          id="panel-handicap-header"
        >
          <Typography>Форы</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {allBetsTitles.handicap.map((b) => (
            <Button
              key={b}
              sx={{
                px: 0,
                m: 0.5,
                bgcolor: '#525252',
                height: '3rem',
                width: '5.5rem',
              }}
              variant="contained"
              onClick={() => handleButtonClick(b)}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {b}
              </Typography>
            </Button>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Счёт матча */}
      <Accordion
        expanded={expandedAccordion === 'Счёт матча'}
        onChange={handleAccordionChange('Счёт матча')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-gameScore-content"
          id="panel-gameScore-header"
        >
          <Typography>Счёт матча</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Счета от 0:0 до 3:3 */}
          <Accordion
            expanded={expandedNestedAccordion === 'Счета от 0:0 до 3:3'}
            onChange={handleNestedAccordionChange('Счета от 0:0 до 3:3')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameScore-normalGameScore-content"
              id="panel-gameScore-normalGameScore-header"
            >
              <Typography>Счета от 0:0 до 3:3</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameScore.normalGameScore.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '4rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Прочие счета */}
          <Accordion
            expanded={expandedNestedAccordion === 'Прочие счета'}
            onChange={handleNestedAccordionChange('Прочие счета')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-gameScore-unusualGameScore-content"
              id="panel-gameScore-unusualGameScore-header"
            >
              <Typography>Прочие счета</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.gameScore.unusualGameScore.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '4rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>

      {/* Голы */}
      <Accordion
        expanded={expandedAccordion === 'Голы'}
        onChange={handleAccordionChange('Голы')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-goals-content"
          id="panel-goals-header"
        >
          <Typography>Голы</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Обе забьют */}
          <Accordion
            expanded={expandedNestedAccordion === 'Обе забьют'}
            onChange={handleNestedAccordionChange('Обе забьют')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-goals-bothTeamScore-content"
              id="panel-goals-bothTeamScore-header"
            >
              <Typography>Обе забьют</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.goals.bothTeamScore.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Обе забьют (по таймам) */}
          <Accordion
            expanded={expandedNestedAccordion === 'Обе забьют (по таймам)'}
            onChange={handleNestedAccordionChange('Обе забьют (по таймам)')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-goals-bothTeamScore_Half-content"
              id="panel-goals-bothTeamScore_Half-header"
            >
              <Typography>Обе забьют (по таймам)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.goals.bothTeamScore_Half.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '8.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Результат матча + Обе забьют */}
          <Accordion
            expanded={expandedNestedAccordion === 'Результат матча + Обе забьют'}
            onChange={handleNestedAccordionChange('Результат матча + Обе забьют')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-goals-bothTeamScore_GameResult-content"
              id="panel-goals-bothTeamScore_GameResult-header"
            >
              <Typography>Результат матча + Обе забьют</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.goals.bothTeamScore_GameResult.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '8.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Обе забьют + Тотал голов */}
          <Accordion
            expanded={expandedNestedAccordion === 'Обе забьют + Тотал голов'}
            onChange={handleNestedAccordionChange('Обе забьют + Тотал голов')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-goals-bothTeamScore_GoalsAmount-content"
              id="panel-goals-bothTeamScore_GoalsAmount-header"
            >
              <Typography>Обе забьют + Тотал голов</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.goals.bothTeamScore_GoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Любая забьет больше Х голов */}
          <Accordion
            expanded={expandedNestedAccordion === 'Любая забьет больше Х голов'}
            onChange={handleNestedAccordionChange('Любая забьет больше Х голов')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-goals-anyTeamScoresMoreThan-content"
              id="panel-goals-anyTeamScoresMoreThan-header"
            >
              <Typography>Любая забьет больше Х голов</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.goals.anyTeamScoresMoreThan.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '17rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>

      {/* Таймы */}
      <Accordion
        expanded={expandedAccordion === 'Таймы'}
        onChange={handleAccordionChange('Таймы')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-half-content"
          id="panel-half-header"
        >
          <Typography>Таймы</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Результат тайма */}
          <Accordion
            expanded={expandedNestedAccordion === 'Результат тайма'}
            onChange={handleNestedAccordionChange('Результат тайма')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-half_gameResult-content"
              id="panel-half-half_gameResult-header"
            >
              <Typography>Результат тайма</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.half_gameResult.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Тайм / Матч */}
          <Accordion
            expanded={expandedNestedAccordion === 'Тайм / Матч'}
            onChange={handleNestedAccordionChange('Тайм / Матч')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-firstHalf_gameResult-content"
              id="panel-half-firstHalf_gameResult-header"
            >
              <Typography>Тайм / Матч</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.firstHalf_gameResult.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* 1й Тайм / 2й Тайм */}
          <Accordion
            expanded={expandedNestedAccordion === '1й Тайм / 2й Тайм'}
            onChange={handleNestedAccordionChange('1й Тайм / 2й Тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-firstHalf_secondHalf-content"
              id="panel-half-firstHalf_secondHalf-header"
            >
              <Typography>1й Тайм / 2й Тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.firstHalf_secondHalf.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Счёт 1й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Счёт 1й тайм'}
            onChange={handleNestedAccordionChange('Счёт 1й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-firstHalf_gameScore-content"
              id="panel-half-firstHalf_gameScore-header"
            >
              <Typography>Счёт 1й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.firstHalf_gameScore.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Счёт 2й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Счёт 2й тайм'}
            onChange={handleNestedAccordionChange('Счёт 2й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-secondHalf_gameScore-content"
              id="panel-half-secondHalf_gameScore-header"
            >
              <Typography>Счёт 2й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.secondHalf_gameScore.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Обе забьют + Результат тайма */}
          <Accordion
            expanded={expandedNestedAccordion === 'Обе забьют + Результат тайма'}
            onChange={handleNestedAccordionChange('Обе забьют + Результат тайма')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-bothTeamScore_halfGameResult-content"
              id="panel-half-bothTeamScore_halfGameResult-header"
            >
              <Typography>Обе забьют + Результат тайма</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.bothTeamScore_halfGameResult.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Фора - 1й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Фора - 1й тайм'}
            onChange={handleNestedAccordionChange('Фора - 1й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-firstHalf_Handicap-content"
              id="panel-half-firstHalf_Handicap-header"
            >
              <Typography>Фора - 1й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.firstHalf_Handicap.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Фора - 2й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Фора - 2й тайм'}
            onChange={handleNestedAccordionChange('Фора - 2й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-secondHalf_Handicap-content"
              id="panel-half-secondHalf_Handicap-header"
            >
              <Typography>Фора - 2й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.secondHalf_Handicap.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Тотал - 1й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Тотал - 1й тайм'}
            onChange={handleNestedAccordionChange('Тотал - 1й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-firstHalf_GoalsAmount-content"
              id="panel-half-firstHalf_GoalsAmount-header"
            >
              <Typography>Тотал - 1й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.firstHalf_GoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Тотал - 2й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Тотал - 2й тайм'}
            onChange={handleNestedAccordionChange('Тотал - 2й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-secondHalf_GoalsAmount-content"
              id="panel-half-secondHalf_GoalsAmount-header"
            >
              <Typography>Тотал - 2й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.secondHalf_GoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Хозяева, Тотал голов - 1й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Хозяева, Тотал голов - 1й тайм'}
            onChange={handleNestedAccordionChange('Хозяева, Тотал голов - 1й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-firstHalf_homeTeamGoalsAmount-content"
              id="panel-half-firstHalf_homeTeamGoalsAmount-header"
            >
              <Typography>Хозяева, Тотал голов - 1й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.firstHalf_homeTeamGoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '8.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Хозяева, Тотал голов - 2й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Хозяева, Тотал голов - 2й тайм'}
            onChange={handleNestedAccordionChange('Хозяева, Тотал голов - 2й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-secondHalf_homeTeamGoalsAmount-content"
              id="panel-half-secondHalf_homeTeamGoalsAmount-header"
            >
              <Typography>Хозяева, Тотал голов - 2й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.secondHalf_homeTeamGoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '8.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Гости, Тотал голов - 1й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Гости, Тотал голов - 1й тайм'}
            onChange={handleNestedAccordionChange('Гости, Тотал голов - 1й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-firstHalf_awayTeamGoalsAmount-content"
              id="panel-half-firstHalf_awayTeamGoalsAmount-header"
            >
              <Typography>Гости, Тотал голов - 1й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.firstHalf_awayTeamGoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '8.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Гости, Тотал голов - 2й тайм */}
          <Accordion
            expanded={expandedNestedAccordion === 'Гости, Тотал голов - 2й тайм'}
            onChange={handleNestedAccordionChange('Гости, Тотал голов - 2й тайм')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-secondHalf_awayTeamGoalsAmount-content"
              id="panel-half-secondHalf_awayTeamGoalsAmount-header"
            >
              <Typography>Гости, Тотал голов - 2й тайм</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.secondHalf_awayTeamGoalsAmount.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 2,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '8.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* 1й тайм - Результат + ТМ */}
          <Accordion
            expanded={expandedNestedAccordion === '1й тайм - Результат + ТМ'}
            onChange={handleNestedAccordionChange('1й тайм - Результат + ТМ')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-firstHalf_gameResult_GoalsTotalLess-content"
              id="panel-half-firstHalf_gameResult_GoalsTotalLess-header"
            >
              <Typography>1й тайм - Результат + ТМ</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.firstHalf_gameResult_GoalsTotalLess.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* 1й тайм - Результат + ТБ */}
          <Accordion
            expanded={expandedNestedAccordion === '1й тайм - Результат + ТБ'}
            onChange={handleNestedAccordionChange('1й тайм - Результат + ТБ')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-firstHalf_gameResult_GoalsTotalMore-content"
              id="panel-half-firstHalf_gameResult_GoalsTotalMore-header"
            >
              <Typography>1й тайм - Результат + ТБ</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.firstHalf_gameResult_GoalsTotalMore.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* 2й тайм - Результат + ТМ */}
          <Accordion
            expanded={expandedNestedAccordion === '2й тайм - Результат + ТМ'}
            onChange={handleNestedAccordionChange('2й тайм - Результат + ТМ')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-secondHalf_gameResult_GoalsTotalLess-content"
              id="panel-half-secondHalf_gameResult_GoalsTotalLess-header"
            >
              <Typography>2й тайм - Результат + ТМ</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.secondHalf_gameResult_GoalsTotalLess.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* 2й тайм - Результат + ТБ */}
          <Accordion
            expanded={expandedNestedAccordion === '2й тайм - Результат + ТБ'}
            onChange={handleNestedAccordionChange('2й тайм - Результат + ТБ')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-secondHalf_gameResult_GoalsTotalMore-content"
              id="panel-half-secondHalf_gameResult_GoalsTotalMore-header"
            >
              <Typography>2й тайм - Результат + ТБ</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.secondHalf_gameResult_GoalsTotalMore.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '5.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Тайм с большим количеством голов */}
          <Accordion
            expanded={expandedNestedAccordion === 'Тайм с большим количеством голов'}
            onChange={handleNestedAccordionChange(
              'Тайм с большим количеством голов'
            )}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-half-halfWithMoreGoals-content"
              id="panel-half-halfWithMoreGoals-header"
            >
              <Typography sx={{ fontSize: '0.85rem' }}>
                Тайм с большим количеством голов
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.half.halfWithMoreGoals.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '17rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>

      {/* Особые ставки */}
      <Accordion
        expanded={expandedAccordion === 'Особые ставки'}
        onChange={handleAccordionChange('Особые ставки')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-special-content"
          id="panel-special-header"
        >
          <Typography>Особые ставки</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Победа всухую */}
          <Accordion
            expanded={expandedNestedAccordion === 'Победа всухую'}
            onChange={handleNestedAccordionChange('Победа всухую')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-special-cleanWin-content"
              id="panel-special-cleanWin-header"
            >
              <Typography>Победа всухую</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.special.cleanWin.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '17rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Разница в счёте */}
          <Accordion
            expanded={expandedNestedAccordion === 'Разница в счёте'}
            onChange={handleNestedAccordionChange('Разница в счёте')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-special-cleanWin-content"
              id="panel-special-cleanWin-header"
            >
              <Typography>Разница в счёте</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {allBetsTitles.special.goalsDifference.map((b) => (
                <Button
                  key={b}
                  sx={{
                    px: 0.5,
                    m: 0.5,
                    bgcolor: '#525252',
                    height: '3rem',
                    width: '8.5rem',
                    textTransform: 'none',
                  }}
                  variant="contained"
                  onClick={() => handleButtonClick(b)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {b}
                  </Typography>
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
