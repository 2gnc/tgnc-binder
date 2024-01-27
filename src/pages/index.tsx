import * as React from "react"
import type { HeadFC, PageProps } from "gatsby";
import { Link } from 'gatsby'

import './index.css';

const IndexPage: React.FC<PageProps> = () => {
    return (
        <div>
            <h1>Landstation Social (версия LEA)</h1>
            <h3>Добро пожаловать в альфа-версию сервиса по управлению коллекцией и обмену картами MTG</h3>
            <p>Цель сервиса - сделать ведение и управление коллекцией карт удобным, а поиск и обмен - быстрым и социально-ориентированным.</p>
            <p>Приложение работает в тестовом режиме. Сейчас его основная задача - определить потребности владельцев коллекций карт для упрощения трейдинга и обмена.</p>
            <p>Доступны коллекции пользователей: </p>
            <ul>
                <li><Link to="ksenia/gallery">Ksenia</Link></li>
                <li><Link to="kaplya/gallery">Kaplya</Link></li>
                <li><Link to="ija/gallery">Ija</Link></li>
                <li><Link to="twobluecats/gallery">TwoBlueCats</Link></li>
                <li><Link to="mrcardholder/gallery">MrCardholder</Link></li>
            </ul>
            <p>Если вы хотите присоединиться к тестированию и опубликовать свою коллекцию - <a href="https://telegram.me/KseniaPolyakova" target="_blank">напишите мне</a></p>
        </div>
    );
}

export default IndexPage

export const Head: HeadFC = () => <title>Landstation Social</title>
