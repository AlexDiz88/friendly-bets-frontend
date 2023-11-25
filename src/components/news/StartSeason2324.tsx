import { useState } from 'react';
import {
	Avatar,
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Collapse,
	IconButton,
	IconButtonProps,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { green } from '@mui/material/colors';

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));

export default function StartSeason2324(): JSX.Element {
	const [expanded, setExpanded] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	const handleLikeToggle = (): void => {
		setIsLiked((prevState) => !prevState);
	};

	const handleExpandClick = (): void => {
		setExpanded(!expanded);
	};
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Card
				sx={{
					mt: 1,
					maxWidth: 345,
					boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
				}}
			>
				<CardHeader
					avatar={
						<Avatar sx={{ bgcolor: green[500] }} aria-label="news-title">
							1
						</Avatar>
					}
					title="Начало сезона 2023-2024"
					subheader="11 Августа, 2023"
				/>
				<CardMedia
					component="img"
					height="194"
					image="/upload/img/borussiya-dortmund-pered-nachalom-sezona-2023-2024.jpg"
					alt="Paella dish"
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						Рад сообщить о начале нового футбольного сезона! В этом году у нас новый сайт. Все
						детали доступны по нажатию кнопки &quot;Подробнее&quot;
					</Typography>
				</CardContent>
				<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<IconButton aria-label="add to favorites" onClick={handleLikeToggle}>
						<FavoriteIcon color={isLiked ? 'error' : 'inherit'} />
					</IconButton>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Typography sx={{ fontSize: '0.85rem' }}>Подробнее</Typography>
						<ExpandMore
							expand={expanded}
							onClick={handleExpandClick}
							aria-expanded={expanded}
							aria-label="show more"
						>
							<ExpandMoreIcon />
						</ExpandMore>
					</Box>
				</CardActions>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<CardContent>
						<Typography paragraph>
							<b>Главные особенности нашего нового сайта:</b>
						</Typography>
						<Typography paragraph>
							1. Авторизация. У каждого участника теперь есть возможность зарегистрироваться на
							сайте, пользоваться личным кабинетом, менять отображаемое имя по желанию. В ближайшее
							время также добавится возможность загрузить вашу фотографию.
							<br />
							<br /> 2. Управление сезонами и ставками теперь осуществляется прямо из сайта, а не в
							таблицах Excel или GoogleSheets как было раньше. Все данные хранятся на официальном
							сайте <a href="https://cloud.mongodb.com">https://cloud.mongodb.com</a>. Добавление и
							обработка ставок теперь проводятся в онлайн режиме. Как только любая ставка добавлена
							или обработана модератором - моментально обновляются сразу все результаты, в том числе
							главная таблица в режиме реального времени.
							<br />
							<br /> 3. Весь дизайн интерфейса сайта разработан на основе голосования предпочтений
							всех участников, для удобства использования именно на смартфоне. Таким образом в
							данный момент не все страницы сайта могут красиво отображаться на большом экране
							монитора. Также возможны различные небольшие проблемы отображения на очень маленьких
							экранах смартофнов. Если вы столкнулись с кривыми таблицами/страницами - сообщите мне
							в личку.
							<br />
							<br /> 4. У нас теперь есть новости сайта (как вот эта, которую вы сейчас читаете :D).
							Они будут редкими, но теперь всегда можно вернуться и почитать какую-либо полезную или
							интересную информацию о нашем сайте, турнире или каких-то нововведениях/изменениях.
							<br />
							<br /> 5. Как вы возможно уже заметили - многие страницы сайта пока что недоступны. Я
							вас уверяю, что в ближайшее время появится много разных таблиц, интересной статистики,
							фильтров, сортировок по разным турнирам/участникам итд., которая всегда будет в
							актульном состоянии. На данный момент есть необходимый минимум в виде главной таблицы,
							списка ставок, результатов ставок и личного кабинета.
							<br />
							<br /> 6. Возможны практически любые, как визуальные так и технические изменения
							сайта. Поэтому если у вас есть пожелания и предложения о том как можно было бы
							улучшить сайт, не стесняйтесь, пишите мне или в общий чат. Всё обсудим и самые
							интересные и полезные идеи реализуем!
						</Typography>
						<Typography paragraph>
							<b>Требования к участникам:</b>
						</Typography>
						<Typography paragraph>
							Для того чтобы участвовать в турнире вам необходимо:
							<br />
							<br /> - Зарегистрироваться на сайте. Для этого нажмите на фотографию мужичка в очках
							и выберите пункт <i>&quot;Зарегистрироваться&quot;</i>. Ваш пароль должен состоять
							минимум из 6 символов.
							<br />
							<br /> - Далее зайдите в личный кабинет (также через этого мужичка) и выберите пункт{' '}
							<i>&quot;Мой профиль&quot;</i>. Далее нажмите <i>&quot;Изменить имя&quot;</i> и
							выберите себе никнейм на сайте. Не пишите слишком длинные имена. В имени можно
							использовать только буквы/цифры, пробел и символы &quot;-&quot;, &quot;_&quot; Ваше
							имя вы сможете поменять в любой момент позже.
							<br />
							<br />- Снова через мужичка выберите <i>&quot;Регистрация на турнир&quot;</i>. В
							открывшемся окне нажать на кнопку регистрации.
							<br />
							Поздравляю! Всё готово :D
						</Typography>
						<Typography paragraph>
							<b>Безопасность сайта:</b>
						</Typography>
						<Typography paragraph>
							Сайт разработан с применением современных технологий по безопасности. Передача всех
							данных осуществляется по защищенному сертификату SSL, используя https соединение.
							Также, например при вводе пароля, используется защищенная клавиатура, помимо этого все
							пароли шифруются c помощью надежной системы BCrypt и хранятся в базе данных в виде
							хеша. Взломать(а именно раскодировать обратно) такой пароль даже при получении доступа
							к базе данных - физически нереально. Поэтому Вы можете спокойно использовать любые
							пароли для регистрации на сайте и быть уверены что они будут надежно защищены.
							<br /> Позже будет добавлена возможность регистрации и входа на сайт с помощью
							Google-аккаунта
						</Typography>
						<Typography paragraph>
							<b>На этом всё! Всем успехов в нашем соревновании!</b>
						</Typography>
						<CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'end' }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Typography sx={{ fontSize: '0.85rem' }}>Свернуть</Typography>
								<ExpandMore
									expand={expanded}
									onClick={handleExpandClick}
									aria-expanded={expanded}
									aria-label="show more"
								>
									<ExpandMoreIcon />
								</ExpandMore>
							</Box>
						</CardActions>
					</CardContent>
				</Collapse>
			</Card>
		</Box>
	);
}
