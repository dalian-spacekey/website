import React from "react";

class AboutPage extends React.Component {
    render() {
        return (
            <div className="contents">
                <h2>About</h2>
                <h3>Name</h3>
                <p>
                    大连空格键信息技术有限公司<br />
                    Dalian Spacekey Information Technology Ltd.
                </p>
                <h3>Capital</h3>
                <p>500,000RMB</p>
                <h3>Date of Establishment</h3>
                <p>2013-01-25</p>
                <h3>Service</h3>
                <ul>
                    <li>计算机软件研发及技术咨询</li>
                    <li>技术服务</li>
                </ul>
                <h3>Engineer</h3>
                <p>福田史浩</p>
                <p>システム開発会社にて、オープン系業務システムを中心にシステム開発業務を経験し、その後フリーの技術者として開発業務を行う。
                    BPOベンチャーに参加、同社のデータエントリシステムの開発やインフラ構築等の立ち上げを担当。
                    データ入力の中国展開にあたり、現地での運用環境の構築、技術チームの立ち上げを経て、現地法人総経理として5年にわたり
                    全社員2,000名のオフショアセンターを管理、運営する経験を持つ。</p>
                <p>技術経験は、主にWindows/業務系のシステムの設計、製造だが、Web系システムやサーバー/ネットワーク構築、
                    システム開発プロセスなど、システムにまつわる技術全般に興味を持ち、個人の趣味としても探求を続けている。</p>
            </div>
        );
    }
}

export default AboutPage;