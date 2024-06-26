import { Box, Container, Fab, Link, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Rules(): JSX.Element {
	const handleScrollToTop = (): void => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<Container>
			<Box sx={{ mx: 0.5, my: 3, textAlign: 'left' }}>
				<Typography sx={{ my: 1 }}>
					<b>1. Взнос за участие</b> - 50 евро (за сезон). Общий банк - зависит от итогового
					количества участников. Приз за 1 место в итоговом зачёте - около 67% от общего банка. Приз
					за 2 место в итоговом зачёте - около 33% от общего банка. Конкретные суммы будут объявлены
					после окончания регистрации всех участников и начала нового футбольного сезона.
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>1.1 Оплата сайта</b> - около 75 евро за хостинг + 10 евро за домен. Итого на содержание
					и обслуживание нашего замечательного сайта требуется около 85 евро (за календарный год).
					Если я смогу найти более дешевый вариант, я сообщу. Но пока что придется смириться с этими
					небольшими тратами. Соответственно, данная сумма будет вычтена из общего банка призовых.
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>2. Футбольные лиги.</b> Ставки делаем на АПЛ, Бундеслигу, Лигу Чемпионов и Лигу Европы
					по 2 матча на каждый тур в каждом турнире.
					<br /> Отдельным соревнованием является Чемпионат Европы и Чемпионат мира. В этих турнирах
					участники делают ставки на каждый матч.
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>3. Размер/сумма ставки.</b> Она одинаковая для всех участников на каждый матч - 10 у.е.
					Исключения: На матчи 1/2 финала ЛЧ и ЛЕ, а также Чемпионата Европы и Чемпионата мира - по
					15 у.е. На Финалы - по 30 у.е.
				</Typography>
				<Box sx={{ my: 1 }}>
					<b>4. Виды ставок.</b> Разрешены только те варианты ставок, которые можно рассчитать глядя
					на итоговый счёт, либо счёт первого тайма. Таким образом ЗАПРЕЩЕНЫ ставки на Угловые,
					Удары, Владение мячом, Карточки, Голы на определённых минутах, Удаления и.т.д. Также
					запрещены ставки на гандикапы, интервалы, на все виды ставок на несколько исходов, волевую
					победу, серии голов.
					<ul>
						Разрешенные типы ставок:
						<li>На победу хозяев/гостей, или ничью (в том числе в первом тайме)</li>
						<li>На точный счет матча/первого тайма</li>
						<li>На фору (кроме Азиатских фор)</li>
						<li>На тотал голов (кроме Азиатских тоталов)</li>
						<li>Голы (обе забьют/нет, индивидуальный тотал)</li>
						<li>
							Микс-ставка: Тотал голов + Результат матча/тайма, Обе забьют+Тотал голов, Тайм+Матч
							и.т.д.
						</li>
					</ul>
					На матчи плей-офф (1/8, 1/4, 1/2 финала) и Финалов ЛЧ и ЛЕ, Чемпионата Европы и Чемпионата
					мира дополнительно можно поставить на результат овертаймов/пенальти.
				</Box>
				<Typography sx={{ my: 1 }}>
					<b>5. Подтверждение ставок.</b> Для фиксации ставок действует специальный чат в WhatsApp.
					Просьба там НИЧЕГО не писать, а скидывать ТОЛЬКО фотографии/скриншоты ваших ставок. В
					момент когда ставку скинули в чат, она считается окончательной и действительной, даже если
					она по каким-либо причинам не выложена на сайт до начала матча.
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>6. Разница в кэфах.</b> Обратите внимание на то, что коэффициенты у букмекеров
					постоянно меняются. Поэтому кэф на одинаковую ставку на один и тот же матч у разных
					участников может отличаться.
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>7. Кэфы.</b> Кэфы для ставок можно брать с сайтов букмекерских контор, таких как,
					например, &quot;Марафон&quot; или &quot;1ХВЕТ&quot;. Для этого на сайте{' '}
					<Link>https://www.marathonbet.com</Link> или <Link>https://1xbet.com/</Link> нужно найти и
					выбрать нужную вам ставку и прислать в чат WhatsApp скриншот, на котором чётко видно матч
					и ставку. Можно использовать и другие букмекерские конторы на выбор участника.
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>!!!ВАЖНО!!!</b> В случае отсутствия двух ставок к моменту окончания тура - все
					несделанные ставки считаются автоматически проигранными (минус 10 у.е. к Вашему балансу за
					каждую ставку) Забытая ставка - это Ваша потерянная ставка! Она не будет переноситься на
					следующие туры. Ставки переносятся ТОЛЬКО в случае официальной отмены/переноса игр из-за
					Covid, Кубковых матчей и.т.д. В случае такого переноса/отмены Вам необходимо сделать новую
					ставку в рамках ЭТОГО ЖЕ игрового тура. Если это невозможно (поскольку больше нет матчей в
					туре), то Ваша ставка переносится на следующий тур, но не позже. Это требование необходимо
					для нормального подведения еженедельных/ежемесячных итогов.
				</Typography>
				<Box sx={{ textAlign: 'center' }}>
					<Fab color="primary" onClick={handleScrollToTop}>
						<KeyboardArrowUpIcon />
					</Fab>
				</Box>
			</Box>
		</Container>
	);
}
