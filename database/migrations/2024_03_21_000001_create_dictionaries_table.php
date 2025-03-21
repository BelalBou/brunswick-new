use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDictionariesTable extends Migration
{
    public function up()
    {
        Schema::create('dictionaries', function (Blueprint $table) {
            $table->id();
            $table->string('tag');
            $table->text('translation_fr');
            $table->text('translation_en');
            $table->boolean('deleted')->default(false);
            $table->timestamps();
            
            $table->index('tag');
            $table->index('deleted');
        });
    }

    public function down()
    {
        Schema::dropIfExists('dictionaries');
    }
} 