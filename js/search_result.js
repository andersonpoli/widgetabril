window.VEJASP        = window.VEJASP || {};
window.VEJASP.Models = window.VEJASP.Models || {};
var Models           = window.VEJASP.Models;

// - Follow just one naming convention
Models.SearchResult = function(rawData) {

  function parseDate(date) {
    if (!date) return '';

    var time    = new Date(Date.parse(date)),
        day     = time.getDate().toString(),
        month   = Models.SearchResult.MONTHS[time.getMonth()],
        year    = time.getFullYear();

    // TODO: Is there a better way to do this?
    day = day.length === 1 ? "0" + day : day;

    return day + "." + month + "." + year;
  }

  function hasResenha(badges) {
    if (!badges) return '';
    return badges.indexOf('resenha') !== -1;
  }

  function firstOfMultivalued(value) {
    return (typeof value === 'object') ? value[0] : value;
  }

  for (var i = 0; i < Models.SearchResult.META_VALUES.length; i++) {
    var meta = Models.SearchResult.META_VALUES[i];
    this[meta] = rawData[meta + '-meta'];
  }

  function endsWith(value, suffix) {
    return jQuery.inArray(suffix, value, value.length - suffix.length) !== -1;
  }

  function generateRouteParams(rawData, brand) {
    if (VEJASP.isMobile !== undefined) {

      if (VEJASP.isMobile.Android()) {
        url = "geo:0,0?q=";
      }
      else if(VEJASP.isMobile.IOS()){
        url = "maps:daddr=";
      }
      else{
        url = 'http://maps.google.com/?&daddr=';
      }

      if (rawData.geo_location) {
        url += rawData.geo_location;
      } else if (rawData.geo_latitude && rawData.geo_longitude){
        url += rawData.geo_latitude + ',' + rawData.geo_longitude;
      }
      
      return url;
    } else {
      return '';
    }
  }

  if (typeof this.description !== 'undefined' && !endsWith(this.description, '.')){
    this.description = this.description + "...";
  } 
  this.como_chegar_url   = rawData.url.replace('estabelecimento','como-chegar');
  this.como_chegar_m_url = generateRouteParams(rawData);
  this.url               = rawData.url;
  this.type_class        = Models.SearchResult.TYPES[rawData['type-meta']];
  this.editorial_rating  = parseInt(rawData['editorial_rating-meta'], 10) || false;
  this.updated_at        = parseDate(rawData['date']);
  this.isEstabelecimento = rawData['type-meta'] === 'estabelecimento';
  this.isAtracao         = rawData['type-meta'] === 'atracao';
  this.isCinema          = rawData['category-meta'] === 'Cinemas';
  /* TODO: Migrando metatag rated_vejasp para avaliado_vejasp */
  this.isRatedVejasp     = rawData['avaliado_vejasp-meta'] ? rawData['avaliado_vejasp-meta'] === "1" : rawData['rated_vejasp-meta'] === 'true';
  this.isMateria         = rawData['type-meta'] === 'materia';
  this.isBlog            = rawData['type-meta'] === 'blogs';
  this.isGuia            = rawData['special_content-meta'] === 'guias';
  this.isTematica        = rawData['special_content-meta'] === 'tematica';
  this.isBairro          = rawData['special_content-meta'] === 'bairros';
  this.hasResenha        = hasResenha(rawData['badges-meta']);
  this.phone             = firstOfMultivalued(rawData['phones-meta']);
  this.main_neighborhood = firstOfMultivalued(rawData['neighborhood-meta']);
  this.user_rating       = parseInt(rawData['user_rating-meta'], 10) || 'none';
  this.userRatingCss     = this.user_rating || 'none';
  this.nome              = this.nome || this.post_title;
  this.titulo            = rawData['title'];
  this.showAvaliacao     = (this.isEstabelecimento || this.isAtracao);
  if (rawData['geo_distance']) {
    this.geo_distance    = Math.round(parseFloat(rawData['geo_distance'].split("E")[0]) * 1000);
  }
};
Models.SearchResult.META_VALUES = [
  'nome', 'category', 'sub_category', 'partner_url', 'user_rating', 'address',
  'city', 'preview', 'description', 'post_title', 'blog_name', 'post_description'
];

Models.SearchResult.MONTHS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'
];

Models.SearchResult.TYPES = {
  estabelecimento: 'establishment',
  atracao:         'attraction',
  materia:         'news',
  blog:            'blog'
};

