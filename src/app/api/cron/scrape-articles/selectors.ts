const allSelectors = {
  // Business Insider
  '1': {
    authorDOMSelector: '.author-aside-name',
    articleDOMSelector: '.tout.as-featured-post',
    articleUrlDOMSelector: 'a.tout-title-link',
    articleTitleDOMSelector: '.tout-title .tout-title-link',
    articlePublishedDateDOMSelector: '.tout-timestamp',
  },
  // NYT
  '2': {
    authorDOMSelector: 'TODO',
    articleDOMSelector: 'TODO',
    articleUrlDOMSelector: 'TODO',
    articleTitleDOMSelector: 'TODO',
    articlePublishedDateDOMSelector: 'TODO',
  },
  // Vice
  '3': {
    authorDOMSelector: '.contributor-page-header__name',
    articleDOMSelector: '.vice-card.vice-card--light.three-up__vice-card',
    articleUrlDOMSelector: '.vice-card-hed__link',
    articleTitleDOMSelector: '.vice-card-hed__link',
    articlePublishedDateDOMSelector: '.vice-card-details__pub-date',
  },
};

export default allSelectors;