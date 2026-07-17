import os
import re

def fix_backend():
    views_path = r"f:\kaira\vgdfashion-arun\vdg-fashion\backend\shop\views.py"
    with open(views_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add MainCategoryViewSet and SubCategoryViewSet
    if "class MainCategoryViewSet" not in content:
        new_viewsets = """
class MainCategoryViewSet(viewsets.ModelViewSet):
    queryset = MainCategory.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = MainCategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', '').strip()
        if not name: return Response({'name': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        MainCategory.objects.filter(name=name, is_active=False).delete()
        data = {k: v for k, v in request.data.items() if k != 'image'}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            instance = serializer.save()
        except Exception as e:
            if 'UNIQUE' in str(e) or 'Duplicate' in str(e):
                return Response({'name': ['Exists.']}, status=status.HTTP_400_BAD_REQUEST)
            raise
        if request.FILES.get('image'):
            instance.image = _save_file(request.FILES['image'], 'categories')
            instance.save()
        return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        MainCategory.objects.filter(pk=instance.pk).update(is_active=False)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = SubCategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', '').strip()
        parent_name = request.data.get('parent_category')
        if not name: return Response({'name': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        SubCategory.objects.filter(name=name, is_active=False).delete()
        
        parent_cat = Category.objects.filter(name=parent_name).first() if parent_name else None
        data = {k: v for k, v in request.data.items() if k != 'image'}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            instance = serializer.save(category=parent_cat)
        except Exception as e:
            if 'UNIQUE' in str(e) or 'Duplicate' in str(e):
                return Response({'name': ['Exists.']}, status=status.HTTP_400_BAD_REQUEST)
            raise
        if request.FILES.get('image'):
            instance.image = _save_file(request.FILES['image'], 'categories')
            instance.save()
        return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        SubCategory.objects.filter(pk=instance.pk).update(is_active=False)
        return Response(status=status.HTTP_204_NO_CONTENT)

"""
        # Insert before CategoryViewSet
        content = content.replace("class CategoryViewSet", new_viewsets + "class CategoryViewSet")
        
        # Modify CategoryViewSet to link to MainCategory
        old_create = """        data = {k: v for k, v in request.data.items() if k != 'image'}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            instance = serializer.save()"""
        new_create = """        data = {k: v for k, v in request.data.items() if k != 'image'}
        parent_name = request.data.get('parent_category')
        parent_main = MainCategory.objects.filter(name=parent_name).first() if parent_name else None
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            instance = serializer.save(main_category=parent_main)"""
        content = content.replace(old_create, new_create)
        
        with open(views_path, 'w', encoding='utf-8') as f:
            f.write(content)

    urls_path = r"f:\kaira\vgdfashion-arun\vdg-fashion\backend\ecommerce_backend\urls.py"
    with open(urls_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "MainCategoryViewSet" not in content:
        content = content.replace(
            "CategoryViewSet, OrderViewSet", 
            "MainCategoryViewSet, CategoryViewSet, SubCategoryViewSet, OrderViewSet"
        )
        content = content.replace(
            "router.register(r'categories', CategoryViewSet, basename='category')",
            "router.register(r'main-categories', MainCategoryViewSet, basename='main-category')\nrouter.register(r'categories', CategoryViewSet, basename='category')\nrouter.register(r'sub-categories', SubCategoryViewSet, basename='sub-category')"
        )
        with open(urls_path, 'w', encoding='utf-8') as f:
            f.write(content)

def fix_frontend():
    page_path = r"f:\kaira\vgdfashion-arun\vdg-fashion\frontend\src\app\admin\page.js"
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix handleSaveCategory endpoint routing
    old_save = """    const url = modalMode === 'edit'
      ? `${API_BASE}/api/categories/${selectedItem.id}/`
      : `${API_BASE}/api/categories/`;"""
    new_save = """    let endpoint = 'categories';
    if (modalType === 'maincategory') endpoint = 'main-categories';
    if (modalType === 'subcategory') endpoint = 'sub-categories';

    const url = modalMode === 'edit'
      ? `${API_BASE}/api/${endpoint}/${selectedItem.id}/`
      : `${API_BASE}/api/${endpoint}/`;"""
    content = content.replace(old_save, new_save)

    # Fix handleSaveCategory payload parent_category bug
    old_payload = """      const payload = {
        name: categoryForm.name,
        is_active: categoryForm.is_active,
        parent_category: categoryForm.category || null,
        image: categoryForm.image || null
      };"""
    new_payload = """      const payload = {
        name: categoryForm.name,
        is_active: categoryForm.is_active,
        parent_category: categoryForm.parent_category || null,
        image: categoryForm.image || null
      };"""
    content = content.replace(old_payload, new_payload)

    # Fix handleDeleteCategory signature and routing
    old_delete = """  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}/`,"""
    new_delete = """  const handleDeleteCategory = async (item) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      let endpoint = 'categories';
      if (item.type === 'main_category') endpoint = 'main-categories';
      if (item.type === 'sub_category') endpoint = 'sub-categories';
      const res = await fetch(`${API_BASE}/api/${endpoint}/${item.id}/`,"""
    content = content.replace(old_delete, new_delete)
    
    # Update onClick to pass whole item
    content = content.replace("onClick={() => handleDeleteCategory(cat.id)}", "onClick={() => handleDeleteCategory(cat)}")

    # Fix UI Labels
    content = content.replace("Main Category name select", "Category select")
    content = content.replace("Select Main Category...<", "Select Category...<")
    content = content.replace("setCategoryForm({ ...categoryForm, category: e.target.value })}", "setCategoryForm({ ...categoryForm, parent_category: e.target.value })}")

    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    fix_backend()
    fix_frontend()
    print("Done")
