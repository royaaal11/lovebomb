document.addEventListener('DOMContentLoaded', function() {
    let tempdata = {
        "did_open": false
    }

    const heart = document.querySelector("#solid-heart");
    const heart_container = document.querySelector(".heart-container");
    
    const msg_container = document.querySelector("#message-container");
    const index = Math.floor(Math.random() * 6);
    const images = ["images.jpg", "cat1.jpg", "cat2.png", "cat3.jpg", "cattt.jpg", "ano.jpg"];
    const text = ["nangangalay panga ko kakangiti", " Handang MAging uto^2 basta ikaw <3",
                "ayaw mo ba sa akin gar? :( ios ios socket ", " Will you be my Valentine? YiIEeeEE HAHAHAHAH apaKA oA", 
                "I hope you never forget to appreciate yourself." ,"Please be gentle and don't pressure yourself too much. love u mwa"];
    const music = ["1.MP3", "2.MP3", "3.MP3", "4.MP3", "5.MP3", "6.MP3" ];
    const gifUrl = images[index]; // Replace with the path to your GIF
    const textContent = text[index]; // Replace with your desired text content
    const soundURL = music[index];
    const audio = new Audio(soundURL);

    // Create an image element for the GIF
    const gifElement = new Image();
    gifElement.src = gifUrl;
    gifElement.style.width = "100%"; // Set the image width to fit the message container
    
    // Create a paragraph element for the text content
    const textElement = document.createElement("p");
    textElement.textContent = textContent;
    
    heart.addEventListener("click", function() {
        if (tempdata.did_open) {
            return;
        }
        tempdata.did_open = true;
        
        // Clear any existing content
        msg_container.innerHTML = '';
        
        // Append the image and text elements to the message container
        msg_container.appendChild(gifElement); // Append the image
        msg_container.appendChild(textElement); // Append the text
        
        msg_container.style.display = "block";
        heart_container.style.marginTop = "-1.5%";
        
        const auto_css_height = msg_container.scrollHeight + 20; 
        msg_container.style.height = auto_css_height + "px";
        audio.play();

        setTimeout(() => {
            msg_container.style.overflowY = "scroll";
        }, 1500);
    });

});
