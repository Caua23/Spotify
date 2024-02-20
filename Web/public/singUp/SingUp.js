var socket = require('./socket_chat/socket.js');
function formulario() {
    var email = document.getElementById('email').value;
    var res = document.getElementById('res');
    var pass = document.getElementById('password1').value;
    var passconfirm = document.getElementById('password2').value;
    var res2 = document.getElementById('res2');

    res.innerHTML = '';
    res2.innerHTML = '';

    if (!email) {
        res.innerHTML = 'Por favor, insira seu endereço de e-mail para prosseguir.';
        return false;
    }

    if (!pass || pass.length < 6) {
        res2.innerHTML = 'A senha fornecida não atende aos requisitos mínimos de segurança. Por favor, escolha uma senha mais robusta e segura.';
        return false;
    }

    if (pass !== passconfirm) {
        res2.innerHTML = 'A senha fornecida não corresponde à confirmação. Por favor, verifique e forneça informações consistentes.';
        return false;
    }
    
    return true;
}

async function verificarEmail(email){
   try {

       const response = await fetch(`/verificar-email?email+${encodeURIComponent(email)}`);
       const data = await response.json()


       return data.exists

   }catch(err){
       console.error('Erro durante a verificação do e-mail:', err);
       return false;
   }
}

verificarEmail(email).then((emailExiste)=>{
    if(emailExiste){
        
    }else{
            // Se a validação do lado do cliente for bem-sucedida, você pode prosseguir com o envio do formulário para o servidor
            // Aqui você pode chamar a função que envia os dados para o servidor ou simplesmente retornar true para permitir o envio padrão do formulário
            console.log('O e-mail está disponível. Você pode prosseguir com o envio do formulário.');
            return true;
        }
        return false;
});

socket.on('mensagem', (msg)=>{
    res.innerHTML = `Esse email já existe`
}) 