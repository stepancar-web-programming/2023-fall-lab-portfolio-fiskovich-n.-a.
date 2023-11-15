document.querySelectorAll('.photo-gallery img').forEach(img=>{
    img.onclick = () => {
        document.querySelector('.pop-up').style.display = 'block';
        document.querySelector('.pop-up img').src = img.getAttribute('src')
    }
});
document.querySelectorAll('.pop-up span').forEach(span => {
    span.addEventListener('click', () => {
        console.log("asdasdasd");
        document.querySelector('.pop-up').style.display = 'none';
    });
});