window.VEJASP    = window.VEJASP || {};
var VEJASP = window.VEJASP;
//////////////////////////////// VEJASP.BSC ////////////////////////////////

VEJASP.BSC = {
  foundResultsTemplate: 'Resultados para <strong>"[termo]"</strong>',

  searchWithBlankKeywordSupport: function() {
    BSC.tmpl.foundResults = this.keyword === '' ?  '' : VEJASP.BSC.foundResultsTemplate;

    var h = this.hits,
    atualPage = this.atualPage,
    param = this.requestQuery();
    this.loadScript(param, function(){});
    this.fqParams = [];
    this.regularParams = [];
  },
  extendBSCCode: function() {
    BSC.search       = VEJASP.BSC.searchWithBlankKeywordSupport;
    BSC.specialFunctions.push(VEJASP.BSC.renderSearchEntry);
  },
  template: function(container) {
    return Mustache.compile(jQuery(container).html());
  },
  renderSearchEntry: function(_, resultObj) {
    return VEJASP.BSC.template('#search-results-template')(new Models.SearchResult(resultObj));
  },
  BSCReady: function(marca){
    VEJASP.BSC.extendBSCCode();
    BSC.servlet = "abrilbusca";
		BSC.context = 'https://www.iba.com.br/public/search/v2/';
    BSC.hits     = 11;
    BSC.ajaxMode = true;
    BSC.didYouMeanAtivo = true;
    BSC.search
  },
 }


//////////////////////////////// Ready ////////////////////////////////


BSC.ready(function(){
  VEJASP.BSC.BSCReady();
});