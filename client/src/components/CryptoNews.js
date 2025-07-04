import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../ThemeContext';

const NewsContainer = styled.div`
  margin-top: 32px;
`;
const NewsTitle = styled.h4`
  margin-bottom: 10px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 15px;
  text-align: center;
`;
const NewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const NewsItem = styled.li`
  margin-bottom: 14px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
`;
const NewsLink = styled.a`
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const NewsMeta = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const CryptoNews = () => {
  const theme = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setNews(data.results || []);
      } catch (e) {
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 1000 * 60 * 5); // 5 phút cập nhật 1 lần
    return () => clearInterval(interval);
  }, []);

  return (
    <NewsContainer>
      <NewsTitle theme={theme}>📰 Tin tức Crypto mới nhất</NewsTitle>
      {loading ? (
        <div style={{ color: theme.colors.textSecondary, textAlign: 'center', fontSize: 13 }}>Đang tải tin tức...</div>
      ) : (
        <NewsList>
          {news.slice(0, 8).map(item => (
            <NewsItem key={item.id} theme={theme}>
              <NewsLink href={item.url} target="_blank" rel="noopener noreferrer" theme={theme}>
                {item.title}
              </NewsLink>
              <NewsMeta theme={theme}>
                {item.published_at ? new Date(item.published_at).toLocaleString('vi-VN') : ''} | {item.source?.title}
              </NewsMeta>
            </NewsItem>
          ))}
        </NewsList>
      )}
    </NewsContainer>
  );
};

export default CryptoNews; 