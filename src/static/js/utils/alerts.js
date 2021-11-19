const errorAlert = Swal.mixin({
    customClass: {
        title: "font-pt-sans text-color-smokyblack",
        footer: "font-pt-sans text-color-smokyblack",
        text: "font-pt-sans text-color-smokyblack",
        confirmButton: "bg-color-xanadu px-4 hover:bg-color-sonicsilver text-white py-2 rounded-full",
    },
    buttonsStyling: false
  })

const joinRoomAlert = Swal.mixin({
    customClass: {
        title: "font-pt-sans text-color-smokyblack",
        input: "font-pt-sans text-color-smokyblack",
        text: "font-pt-sans text-color-smokyblack",
        confirmButton: "bg-color-xanadu px-4 hover:bg-color-sonicsilver text-white py-2 rounded-full"
    },
    buttonsStyling: false
    
});

const youtubeRoomAlert = Swal.mixin({
    customClass: {
        input: "font-pt-sans text-color-smokyblack",
        text: "font-pt-sans text-color-smokyblack",
        confirmButton: "bg-color-xanadu px-4 hover:bg-color-sonicsilver text-white py-2 rounded-full"
    },
    buttonsStyling: false
    
})