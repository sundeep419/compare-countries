Number.prototype.toReadable = function(){
	return String(this).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
};
countryComparer={

	bindEditCountryTriggerLink:function(){
		var that=this;
		$('.country .modal-trigger').click(function(ev){
			ev.preventDefault();
			that.currentEditingCountryIndex=parseInt(this.dataset.countryIndex);
			$('#edit-country-modal').modal('open');
		});
	},
	bindModalLinks:function(){
		var that=this;
		$('#edit-country-modal .collection-item').click(function(ev){
			ev.preventDefault();
			var countryCode= this.dataset.countryCode;
			var country=that.fetchCountryByCode(countryCode);
			$('#country-' + that.currentEditingCountryIndex + ' p').html(country.name);
			$('#edit-country-modal').modal('close');
			$('#country-' + that.currentEditingCountryIndex + ' h2 .new').html(country.alpha3Code);
			
			that.renderCountry(countryCode);
		})
	},
	fetchAllCountries:function(){
		var that =this;
		$.ajax({
			url:"https://restcountries.eu/rest/v1/all"
		}).done(function(data){
			that.allCountries=data;
			that.popluateModalContent();
			that.bindModalLinks();
			that.currentEditingCountryIndex=0;
			that.renderCountry('IND');
			that.currentEditingCountryIndex=1;
			that.renderCountry('USA');
			that.showMainContent();
			
		});
	},
	fetchCountryByCode:function(countryCode){
		var match;
		var allCountries=this.allCountries;
		for(i=0;i< allCountries.length;i++){
			var country=allCountries[i];
			if(country.alpha3Code==countryCode){
				match=country;
				break;
			}
		}return match;
	},
	init:function(){
		this.fetchAllCountries();
		this.initializeModal();
		this.bindEditCountryTriggerLink();
	},
	initializeModal: function(){
		$('.modal').modal();
	},
	popluateModalContent: function(){
		var links="";
		this.allCountries.forEach(function(country){
			links +=("<a href='#' class='collection-item' data-country-code='"+country.alpha3Code+"'>"+country.name+"</a>");
		});
		$('#edit-country-modal .collection').html(links);
	},
	renderCountry:function(countryCode){
		var country=this.fetchCountryByCode(countryCode);
		$('#country-' + this.currentEditingCountryIndex + ' h2 .new').html(country.alpha3Code);
		$('#country-' + this.currentEditingCountryIndex + ' p.name').html(country.name);
		$('#country-' + this.currentEditingCountryIndex + ' .population p').html(country.population.toReadable());
		$('#country-' + this.currentEditingCountryIndex + ' .area p').html(country.area.toReadable()+"<span class='units'>km<sup>2</sup></span>");
		var populationDensity=parseInt(country.population/country.area);
		$('#country-' + this.currentEditingCountryIndex + ' .populationDensity p').html(populationDensity+"<span class='units'>people/km<sup>2</sup></span>");
		$('#country-' + this.currentEditingCountryIndex + ' .gini p').html(country.gini);	
	},
	showMainContent:function(){
		$('#loader').addClass('hide');
		$('#content').removeClass('hide');
	}
};
$(document).ready(function(){
	countryComparer.init();
});

