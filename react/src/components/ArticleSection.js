import React, { useEffect, useState } from "react";

const ArticleSection = () => {
    const [article, setArticle] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const API_MEDIA_URL = process.env.REACT_APP_API_MEDIA;

    useEffect(() => {
        fetch(`${API_BASE_URL}/latest-article/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.image && !isAbsoluteUrl(data.image)) {
                    data.image = `${API_MEDIA_URL}${data.image}`;
                }
                setArticle(data);
            })
            .catch(error => {
                console.error("Ошибка загрузки статьи:", error);
            });
    }, [API_BASE_URL, API_MEDIA_URL]);

    const isAbsoluteUrl = (url) => {
        return /^https?:\/\//i.test(url);
    };

    if (!article) {
        return <div>Загрузка статьи...</div>;
    }

    return (
        <section className="article-section">
            <h3>{article.title}</h3>
            {article.image && (
                <img
                    src={article.image}
                    alt={article.title}
                    className="article-image"
                />
            )}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
            <small>Опубликовано: {new Date(article.created_at).toLocaleDateString()}</small>
        </section>
    );
};

export default ArticleSection;