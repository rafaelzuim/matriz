$(document).ready(
        function(){
            rotateElement = function(imageId,canvasId,degree){
                var img = document.getElementById(imageId);
                var canvas = document.getElementById(canvasId);

                var cContext = canvas.getContext('2d');

                var cw = img.width, ch = img.height, cx = 0, cy = 0;

                // recalculando as dimensões que a imagem terá após fazer a totação
                switch(degree){
                     case 90:
                          cw = img.height;
                          ch = img.width;
                          cy = img.height * (-1);
                          break;
                     case 180:
                          cx = img.width * (-1);
                          cy = img.height * (-1);
                          break;
                     case 270:
                          cw = img.height;
                          ch = img.width;
                          cx = img.width * (-1);
                          break;
                }

                //  agora que tenho os valores widht e height posso fazer a rotação
                canvas.setAttribute('width', cw);
                canvas.setAttribute('height', ch);
                cContext.rotate(degree * Math.PI / 180);
                cContext.drawImage(img, cx, cy);
            }
        }
)
