// Conexão ao banco de dados MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/foods', { useNewUrlParser: true });

//Adicionando um ID autoincrementável e inalterável a cada alimento
const autoIncrement = require('mongoose-auto-increment');

//criando interatividade com o usuário
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Modelo de alimento
const FoodSchema = new mongoose.Schema({
    name: String,
    protein: Number,
    carbo: Number,
    fat: Number
});

FoodSchema.plugin(autoIncrement.plugin, { model: 'Food', field: '_id' });

const Food = mongoose.model('Food', FoodSchema);

autoIncrement.initialize(mongoose.connection);

// Inicializando alguns alimentos
const chicken = new Food({ name: 'Frango desfiado', protein: 25, carbo: 0, fat: 2 });
const rice = new Food({ name: 'Arroz branco', protein: 6, carbo: 28, fat: 0 });
const blackBeans = new Food({ name: 'Feijão preto', protein: 15, carbo: 42, fat: 1 });
const mashedPotatoes = new Food({ name: 'Purê de batata', protein: 2, carbo: 20, fat: 4 });
const carrots = new Food({ name: 'Cenoura refogada', protein: 1, carbo: 10, fat: 3 });
const broccoli = new Food({ name: 'Brócolis', protein: 2, carbo: 6, fat: 0 });
const groundBeef = new Food({ name: 'Carne moída (patinho)', protein: 20, carbo: 0, fat: 12 });
const egg = new Food({ name: 'Ovo', protein: 6, carbo: 1, fat: 5 });
const greekYogurt = new Food({ name: 'Iogurte grego', protein: 15, carbo: 6, fat: 5 });

// Adicionando os alimentos ao banco de dados
chicken.save();
rice.save();
blackBeans.save();
mashedPotatoes.save();
carrots.save();
broccoli.save();
groundBeef.save();
egg.save();
greekYogurt.save();


// Classe para comunicação com o usuário
class Menu {

  // Adicionando um alimento
  static addFood(name, protein, carbo, fat) {
    if (!name || !protein || !carbo || !fat) {
      console.log('Todos os campos são obrigatórios.');
      return;
    }
    if (isNaN(protein) || isNaN(carbo) || isNaN(fat)) {
      console.log('Proteína, carboidratos e gordura devem ser números.');
      return;
    }
    const newFood = new Food({ name: name, protein: protein, carbo: carbo, fat: fat });
    newFood.save((error) => {
      if (error) {
        console.log("erro ao adicionar o alimento: " + error);
      } else {
        console.log(`${name} adicionado com sucesso!`);
      }
    });
  }


    // Listando todos os alimentos
    static list() {
        Food.find({}, (error, foods) => {
        if (error) {
            console.log("erro ao listar os alimentos: " + error);
        } else {
            console.log(foods);
        }
        });
    }


    // Buscando um alimento específico
    static find(name) {
        Food.find({ name: name }, (error, food) => {
        if (error) {
            console.log("erro ao procurar o alimento: " + error);
        } else {
            console.log(food);
        }
        });
    }


    // Atualizando um alimento
    static update(id, name, protein, carbo, fat) {
        Food.findByIdAndUpdate(id, { name: name, protein: protein, carbo: carbo, fat: fat }, (error, food) => {
            if (error) {
            console.log("erro ao atualizar o alimento: " + error);
            } else {
            console.log(`${food.name} foi atualizado com sucesso!`);
            }
        });
        }




    // Excluindo um alimento
    static delete(id) {
        Food.findByIdAndDelete(id, (error, food) => {
        if (error) {
            console.log("Erro ao excluir o alimento " + food.name +": " + error);
        } else {
            console.log(`${food.name} foi excluíd com sucesso!`);
        }
        });
    }
    }


class Teste {
    static async menu() {
        while (true) {
            console.log("Escolha uma opção:");
            console.log("1 - Listar todos os alimentos");
            console.log("2 - Procurar por um alimento específico");
            console.log("3 - Adicionar um alimento");
            console.log("4 - Atualizar um alimento");
            console.log("5 - Excluir um alimento");
            console.log("6 - Sair do sistema");

            rl.question("Digite a opção desejada: ", async (opcao) => {
                switch (parseInt(opcao)) {
                    case 1:
                        console.log("Listando todos os alimentos:");
                        await Menu.list();
                        break;

                    case 2:
                        rl.question("Digite o nome do alimento a ser procurado: ", async (name) => {
                            console.log("Procurando por " + name + ":");
                            await Menu.find(name);
                        });
                        break;

                    case 3:
                        rl.question("Digite o nome do alimento a ser adicionado: ", async (foodName) => {
                            rl.question("Digite a quantidade de proteína do alimento " + foodName + ": ", async (foodProtein) => {
                                rl.question("Digite a quantidade de carboidratos do alimento " + foodName + ": ", async (foodcarbos) => {
                                    rl.question("Digite a quantidade de gordura do alimento " + foodName + ": ", async (foodFat) => {
                                        console.log("Adicionando " + foodName + ":");
                                        await Menu.addFood(foodName, parseInt(foodProtein), parseInt(foodcarbos), parseInt(foodFat));
                                    });
                                });
                            });
                        });
                        break;
                    
                        case 4:
                            rl.question("Digite o nome do alimento a ser atualizado: ", async (foodUpdate) => {
                                rl.question("Digite a nova quantidade de proteína do alimento " + foodUpdate + ": ", async (newProtein) => {
                                    rl.question("Digite a nova quantidade de carboidratos do alimento " + foodUpdate + ": ", async (newcarbos) => {
                                        rl.question("Digite a nova quantidade de gordura do alimento " + foodUpdate + ": ", async (newFat) => {
                                            console.log("Atualizando " + foodUpdate + ":");
                                            await Menu.update(foodUpdate, { protein: parseInt(newProtein), carbo: parseInt(newcarbos), fat: parseInt(newFat) });
                                        });
                                    });                  
                                });
                            });
                            break;

                        case 5:
                            rl.question("Digite o nome do alimento a ser excluído: ", async (foodDelete) => {
                                console.log("Excluindo " + foodDelete + ":");
                                await Menu.delete(foodDelete);
                            });
                            break;

                        case 6:
                            console.log("Saindo do sistema...");
                            rl.close();
                            return;

                        default:
                            console.log("Opção inválida. Escolha novamente.");
                            break;
                    }
                });
            }
        }
    }

Teste.menu();