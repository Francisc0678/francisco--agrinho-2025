let umidade = 50; // Umidade inicial (0-100)
let gotas = []; // Array para armazenar as gotas de chuva
let nuvens = []; // Posições das nuvens
let planta = { y: 300, tamanho: 0 }; // Dados da planta

function setup() {
  createCanvas(600, 400);
  
  // Cria 3 nuvens em posições aleatórias no topo
  for (let i = 0; i < 3; i++) {
    nuvens.push({
      x: random(width),
      y: random(50, 100),
      largura: random(80, 120)
    });
  }
}

function draw() {
  // Céu gradiente (azul claro → branco)
  let corCeu = lerpColor(color(135, 206, 235), color(255), 0.3);
  background(corCeu);
  
  // Desenha o solo (muda de cor conforme a umidade)
  let marromSeco = color(139, 69, 19); // Marrom (seco)
  let marromUmido = color(101, 67, 33); // Marrom (úmido)
  let corSolo = lerpColor(marromSeco, marromUmido, umidade / 100);
  fill(corSolo);
  noStroke();
  rect(0, 300, width, 100);
  
  // Desenha as nuvens
  fill(240);
  for (let nuvem of nuvens) {
    ellipse(nuvem.x, nuvem.y, nuvem.largura, 40);
    ellipse(nuvem.x - 30, nuvem.y + 10, 60, 30);
    ellipse(nuvem.x + 30, nuvem.y + 10, 60, 30);
    
    // 5% de chance de criar uma gota a cada frame
    if (random() < 0.05) {
      gotas.push({
        x: nuvem.x + random(-20, 20),
        y: nuvem.y + 30,
        velocidade: random(3, 6)
      });
    }
  }
  
  // Atualiza e desenha as gotas de chuva
  for (let i = gotas.length - 1; i >= 0; i--) {
    let gota = gotas[i];
    fill(0, 100, 255, 150); // Azul transparente
    ellipse(gota.x, gota.y, 5, 10);
    gota.y += gota.velocidade;
    
    // Remove gotas que atingiram o solo e aumenta umidade
    if (gota.y > 300) {
      gotas.splice(i, 1);
      umidade = min(100, umidade + 2); // Limita a 100%
    }
  }
  
  // Planta cresce conforme a umidade
  if (umidade > 30 && planta.tamanho < 100) {
    planta.tamanho += 0.1;
  } else if (umidade <= 30 && planta.tamanho > 0) {
    planta.tamanho -= 0.2; // Planta murcha se estiver muito seco
  }
  
  // Desenha a planta (broto → adulta)
  fill(34, 139, 34);
  if (planta.tamanho > 0) {
    // Caule
    rect(width/2 - 3, planta.y - planta.tamanho, 6, planta.tamanho);
    // Folhas (aparecem quando a planta é grande o suficiente)
    if (planta.tamanho > 30) {
      ellipse(width/2 + 10, planta.y - planta.tamanho/2, 20, 10);
      ellipse(width/2 - 10, planta.y - planta.tamanho/3, 20, 10);
    }
    // Flor (aparece no estágio final)
    if (planta.tamanho > 80) {
      fill(255, 215, 0);
      ellipse(width/2, planta.y - planta.tamanho - 5, 15);
    }
  }
  
  // Umidade diminui naturalmente com o tempo
  umidade = max(0, umidade - 0.05);
  
  // Exibe informações na tela
  fill(0);
  textSize(16);
  text(`Umidade do solo: ${int(umidade)}%`, 20, 30);
  text("Clique para forçar chuva!", 20, 60);
}

// Cria uma rajada de gotas ao clicar
function mousePressed() {
  for (let i = 0; i < 20; i++) {
    gotas.push({
      x: mouseX + random(-50, 50),
      y: mouseY + random(-20, 20),
      velocidade: random(4, 8)
    });
  }
}