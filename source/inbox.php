<!DOCTYPE html>
<html>
    <head>
        <!-- CSS Resources -->
        <link rel="stylesheet" href="css/scoonsdesign1.css" />
        <link rel="stylesheet" href="css/sampleConfigurator.css" />
        <link rel="stylesheet" href="css/perfect-scrollbar.min.css" />
    </head>
    <body>
        <div class="page-container">
            <div class="page-header">
                <div class="logo-bar">
                    <div class="logo"><img src="images/scoons-logo.png" /></div>
                    <div class="header-options">
                        <ul>
                            <li>Build a Sample Board</li>
                            <li>Products and Services</li>
                            <li>Our Process</li>
                            <li>About Us</li>
                            <li class="login-option">Login</li>
                        </ul>
                    </div>
                    
                    
                </div>
                <div class="cover-container">
                    <div class="cover-text">
                        <div class="cover-header">Build Your Own Sample Board</div>
                        <div class="cover-body">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
                    </div>
                    <div class="cover-photo">
                        <img src="images/board-example.png" />
                    </div>
                </div>
            </div>
            <div class="page-content"></div>
            <div class="page-footer"><ul></ul></div>
        </div>
        
        <script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
        <script type="text/javascript" src="js/jquery-ui.min.js"></script>
        <script type="text/javascript" src="js/jquery.sample-config.js"></script>
        <script type="text/javascript" src="js/perfect-scrollbar.jquery.min.js"></script>
        
        <script>
            var sampler = $('.page-content').sampleconfig({initCallback: function(){
                $('.sample-list').perfectScrollbar();
            }});
            
        </script>
    </body>
</html>