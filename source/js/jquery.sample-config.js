
!function($){

    var defaults = {
        dataFile: 'json/samples.json',
        initCallback: function(){}
    };
    
    var SampleConfigurator = function(el, options){
        this.$el = $(el);
        this.$sampler = '';
        this.$sampleHeader = '';
        this.$sampleBoard = '';
        this.$sampleList = '';
        this.$isDragging = false;
        this.$isMouseDown = false;
        this.sampleList = {};
        
        if (!this.$el.length)
            throw new Error('You must bind Sample Configurator on an existing element.');
        
        return this.init(options);
    };
    SampleConfigurator.prototype = {
        init: function(options){
            this.__class__ = 'SampleConfigurator';
            this.__version__ = '0.1';
            
            this.settings = $.extend( {}, defaults, options );
            
            console.log(this.settings.dataFile);
            $.getJSON( this.settings.dataFile, $.proxy(function( data ) {
                this.setupConfigurator();
                this.addSamples(data);
                
                //Set board layout
                this.setBoardLayout(2, 3);
                this.setupEvents();
                
                //Callback after instantiation
                this.settings.initCallback();
            },this));
            
            return this;
        },
        setupConfigurator: function(){
            this.$el.append('<div class="sample-config"><div class="sample-container"><div class="sample-header"></div><div class="sample-board-container"></div></div><div class="sample-list-container"><div class="sample-list-header"><p>Select a Sample</p></div><div class="sample-list"><ul></ul></div></div></div>');
            this.$sampler = this.$el.find('.sample-config');
            this.$sampler.height($(window).height());
            
            //Header
            this.$sampleHeader = this.$sampler.find('.sample-header');
            this.$sampleHeader.append('<div class="sample-header-text">Select A Sample Board</div><div class="board-options"><ul></ul></div>');
            
            this.$sampleBoard = this.$sampler.find('.sample-board-container');
            //this.$samplerBoard.append('<div class="board"><div class="board-row"><div class="board-cell"></div><div class="board-cell"></div><div class="board-cell"></div></div><div class="board-row"><div class="board-cell"></div><div class="board-cell"></div><div class="board-cell"></div></div></div>');
            
            this.$samplerList = this.$sampler.find('.sample-list');
            
            //Add sample listStyleType
            
        },
        setupEvents: function(){
            $('.sample-item').mousedown($.proxy(function(event){
                this.isMouseDown = true;
                
                console.log("down");
                
                //deselect text
                event.preventDefault();
                document.getSelection().removeAllRanges();
                
                //Get the target sample
                $target = $(event.currentTarget);
                
                //Get sample info
                var id = $target.attr('sampleID');
                
                //Create draggable element
                var $dragSample = $('<div class="drag-sample"><img src="images/samples/'+this.sampleList[id].image+'" /></div>');
                $dragSample.css({top: (event.pageY-50).toString()+'px', left: (event.pageX-50).toString()+'px', pointerEvents: 'none'});
                $('body').append($dragSample);
                
                //Move element
                $('body').mousemove($.proxy(function(e){
                    if(this.isMouseDown){
                        $dragSample.css({top: (e.pageY-50).toString()+'px', left: (e.pageX-50).toString()+'px'});
                        //var $inside = this.insideBoardCell(e.pageY-50, e.pageX-50);
                        //if($inside) $inside.css({backgroundImage:'url(images/samples/'+this.sampleList[id].image+')'});
                    }
                },this));
                
                this.$sampler.find('.board-cell').mouseenter($.proxy(function(e){
                    console.log("enter");
                    $(e.currentTarget).css({backgroundImage:'url(images/samples/'+this.sampleList[id].image+')'});
                },this))
                
                this.$sampler.find('.board-cell').mouseleave($.proxy(function(e){
                    console.log("leave");
                    if(!this.insideBoardCell(e.pageY-50, e.pageX-50)) $(e.currentTarget).css({backgroundImage:'url()'});
                },this));
                //*/
                
                $('body').mouseup($.proxy(function(){
                    $dragSample.remove();
                    this.isMouseDown = false;
                    $('body').unbind('mouseup');
                    $('body').unbind('mousemove');
                    this.$sampler.find('.board-cell').unbind('mouseenter');
                    this.$sampler.find('.board-cell').unbind('mouseleave');
                },this));
                
            },this));
            
        },
        destroyEvents: function(){},
        addSamples: function(sampleData){
            $.each(sampleData.samples, $.proxy(function(index, samp){
                this.sampleList[samp.id] = samp
                
                var sampleItem = '<li class="sample-item" sampleID="'+samp.id+'"><div class="sample-img"><img src="images/samples/'+samp.image+'"/></div><div class="sample-name">'+samp.name+'</div></li>';
                this.$sampler.find('.sample-list ul').append(sampleItem);
            },this));
            
            console.log(this.sampleList);
        },
        setBoardLayout: function(row, col){
            var boardLayout = '<div class="board">';
            for(var i = 0; i < row; i++){
                boardLayout += '<div class="board-row">'
                for(var j = 0; j < col; j++){
                    boardLayout += '<div class="board-cell"><p>Drag Sample Here</p></div>';
                }
                boardLayout += '</div>';
            }
            boardLayout += '</div>';
            this.$sampleBoard.html(boardLayout);
        },
        insideBoardCell: function(x, y){
            console.log('starting '+x.toString()+', '+y.toString());
            var $inside = false;
            this.$sampler.find('.board-cell').each($.proxy(function(i, el){
                var $el = $(el);
                var elX = $el.offset().left;
                var elY = $el.offset().top;
                var elXMax = elX + $el.width();
                var elYMax = elY + $el.height();
                console.log(elX.toString()+', '+elY.toString()+' and '+elXMax.toString()+', '+elYMax);
                if(x >= elX && x <= elXMax && y >= elY && y <= elYMax) $inside = $el;
            }));
            
            console.log($inside);
            return $inside;
        }
    };
    
    $.fn.sampleconfig = $.fn.smpl = function (options) {
        if (this.length > 1) {
            var instances = [];

            this.each(function () {
                instances.push($(this).sample-config(options));
            });

            return instances;
        }

        // Return undefined if applied to non existing DOM element
        if (!$(this).length) {
            //Sample Configurator
            return;
        }

        return new SampleConfigurator(this, options);
  };
    
}(window.jQuery);