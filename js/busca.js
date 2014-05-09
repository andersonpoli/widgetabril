window.VEJASP    = window.VEJASP || {};
var VEJASP = window.VEJASP;


VEJASP.changeUrlFiltro = function(filtro) {
    window.location.hash = "#&category-meta_nav:" + filtro;
}

VEJASP.SaveFilters = function(filtro){
  var filtros = [];
  if(localStorage['filtros']){
    filtros = localStorage['filtros'].split(',');
  }

  if (filtros.indexOf(filtro) === -1) {
    filtros.push(filtro);
  }else{
    filtros.splice(filtros.indexOf(filtro));
  }
  localStorage['filtros'] = filtros;
}

VEJASP.filtroTipo = function(obj){
  $("ul.tipos li").removeClass('selecionado');
  //armazena em uma variável o valor do filtro por tipo
  var valor_filtrotipo = obj.data("filtrotipo");
  if(VEJASP.mobileScreen()){
    var texto_filtro_mobile = $(".filtro-mobile").text();
    var novo_texto_filtro_mobile = obj.text();
    obj.text(texto_filtro_mobile).attr('data-filtrotipo', texto_filtro_mobile);
    $(".filtro-mobile").text(novo_texto_filtro_mobile);
    $("ul.tipos").toggleClass('hidden-xs');
  }else{
    obj.addClass('selecionado');
  }

  VEJASP.BSC.changeUrlFiltro(valor_filtrotipo);
}
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

  AjustePaginacao: function(){
    var paginacao = $('#bsc_paginador a');
    $.each(paginacao, function(index, val) {
      var hrefpag = $(this).attr('href').replace('http://', 'chrome-extension://');
      $(this).attr('href', hrefpag);
    });
  },

  BSCReady: function(marca){
    VEJASP.BSC.extendBSCCode();
    BSC.servlet = "vejasp";
		BSC.context = 'https://www.iba.com.br/public/search/v2/';
    BSC.hits     = 10;
    BSC.ajaxMode = true;
    BSC.didYouMeanAtivo = true;
    BSC.tmpl.paginate.next = '';
    BSC.tmpl.paginate.numberOfPages = 4;
  },
  
 }

//////////////////////////////// Ready ////////////////////////////////

BSC.ready(function(){
  VEJASP.BSC.BSCReady();
  BSC.after(function(){
    VEJASP.BSC.AjustePaginacao();
  });
});
