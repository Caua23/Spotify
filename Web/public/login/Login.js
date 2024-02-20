
function formulario() {
    let email = document.getElementById('inputText').value;
    let pass = document.getElementById('inputPass').value;
    let res = document.getElementById('res')
    if (email == '' || pass == '') {
        res.innerHTML = 'Coloque Suas informações abaixo '

        return false
    } else {
        existingUser(email, pass).then((usersExist) => {
            if (usersExist) {
                console.log('logado');
                window.location.href = '/index.html'

            }
        })
    }
}

async function existingUser(email, Password) {
    try {

        const response = await fetch(`/verificar-usuario?email=${encodeURIComponent(email)}&Password=${encodeURIComponent(Password)}`);
        const data = await response.json()


        return data.exists

    } catch (err) {
        console.error('Erro durante a verificação do e-mail:', err);
        return false;
    }
}



