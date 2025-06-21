import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/auth";

const ArticleSection = ({ isLoggedIn }) => {
    const [article, setArticle] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const API_BASE_URL = '/api';
    
    const formatDate = (dateString) => {
        const options = {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", options);
    };

    useEffect(() => {
        const loadArticle = async () => {
            const accessToken = localStorage.getItem("accessToken");
            let response;

            try {
                // Попытка использовать fetchWithAuth, если токен существует
                if (accessToken) {
                    response = await fetchWithAuth(`${API_BASE_URL}/latest-article/`);
                }

                // Если fetchWithAuth вернул null или токена нет, используем обычный fetch
                if (!response || !accessToken) {
                    response = await fetch(`${API_BASE_URL}/latest-article/`);
                }

                // Обработка ошибок HTTP
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();

                // Обработка изображения
                if (data.image && !isAbsoluteUrl(data.image)) {
                    data.image = `${data.image}`;
                }

                // Установка состояний
                setArticle(data);
                setIsLiked(data.is_liked || false);
                setLikesCount(data.likes_count || 0);
            } catch (error) {
                console.error("Ошибка загрузки статьи:", error);
                alert("Не удалось загрузить статью. Попробуйте позже.");
            }
        };

        loadArticle();
    }, [API_BASE_URL]);

    const isAbsoluteUrl = (url) => {
        return /^https?:\/\//i.test(url);
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) {
            alert("Нельзя добавить пустой комментарий.");
            return;
        }
        if (!isLoggedIn) {
            alert("Вам нужно авторизоваться чтобы оставить комментарий.");
            return;
        }
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/add-comment/${article.id}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ text: commentText }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const data = await response.json();
            setArticle((prev) => ({
                ...prev,
                comments: [...prev.comments, data],
            }));
            setCommentText("");
        } catch (error) {
            console.error("Ошибка добавления комментария:", error);
            alert("Не удалось добавить комментарий. Попробуйте позже.");
        }
    };

    const handleToggleLike = async () => {
        if (!isLoggedIn) {
            alert("Вам нужно авторизоваться чтобы поставить лайк");
            return;
        }
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/toggle-like/${article.id}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            if (response.status === 201) {
                setIsLiked(true);
                setLikesCount((prev) => prev + 1);
            } else {
                setIsLiked(false);
                setLikesCount((prev) => prev - 1);
            }
        } catch (error) {
            console.error("Ошибка переключения лайка:", error);
        }
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
            
            <button onClick={handleToggleLike}>
                {isLiked ? (
                    <i className="like-icon" style={{ color: "#BC0022" }}>❤️</i>
                ) : (
                    <i className="like-icon">🤍</i>
                )}
                {likesCount}
            </button>
            
            <button onClick={() => setShowComments(!showComments)}>
                <i className="comment-icon">💬</i> {article.comments.length}
            </button>

            {showComments && (
                <div className={`comments-section ${showComments ? 'show' : ''}`}>
                    {isLoggedIn && (
                        <div className="addcomment-div">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Ваш комментарий"
                            />
                            <button className="comment-addbutton" onClick={handleAddComment}>
                                Добавить комментарий
                            </button>
                        </div>
                    )}

                    {article.comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <strong>{comment.full_name}</strong>
                            <p>{comment.text}</p>
                            <small>{formatDate(comment.created_at)}</small>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ArticleSection;